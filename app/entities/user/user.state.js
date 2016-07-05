(function() {
    'use strict';

    angular
        .module('testjhipsterApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('user', {
            parent: 'entity',
            url: '/user?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'testjhipsterApp.user.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/user/users.html',
                    controller: 'UserController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('user');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('user-detail', {
            parent: 'entity',
            url: '/user/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'testjhipsterApp.user.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/user/user-detail.html',
                    controller: 'UserDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('user');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'User', function($stateParams, User) {
                    return User.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('user.new', {
            parent: 'user',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/user/user-dialog.html',
                    controller: 'UserDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                age: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('user', null, { reload: true });
                }, function() {
                    $state.go('user');
                });
            }]
        })
        .state('user.edit', {
            parent: 'user',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/user/user-dialog.html',
                    controller: 'UserDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['User', function(User) {
                            return User.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('user', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('user.delete', {
            parent: 'user',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/user/user-delete-dialog.html',
                    controller: 'UserDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['User', function(User) {
                            return User.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('user', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
