'use strict';

angular.module('aksiteApp')
    .controller('PostEditorCtrl', function($scope, $http, $upload, $stateParams, $state, $sanitize, Auth) {
        $scope.loadingPost = true;
        $scope.currentUser = Auth.getCurrentUser();
        if(!$stateParams.postId || $stateParams.postId === 'new') {
            $scope.post = {
                title: 'Untitled Post',
                subheader: undefined,
                alias: undefined,
                hidden: false,
                author: {
                    name: $scope.currentUser.name,
                    id: $scope.currentUser._id,
                    imageId: $scope.currentUser.imageId,
                    smallImageId: $scope.currentUser.smallImageId
                },
                date: new Date(),
                imageId: undefined,
                content: undefined,
                categories: []
            };
            $scope.loadingPost = false;
            $scope.newPost = true;
        } else {
            $http.get('/api/posts/'+$stateParams.postId)
                .success(function(res) {
                    console.log(res);
                    $scope.post = res;
                    $scope.filename = $scope.post.imageId;
                    if($scope.post.hidden !== true || $scope.post.hidden !== false) {
                        $scope.post.hidden = false;
                    }
                })
                .error(function(res, status) {
                    $scope.error = {status: status, res: res};
                })
                .finally(function() {
                    $scope.loadingPost = true;
                });
        }
        console.log($scope.currentUser);

        $scope.markedContent = function() {
            try {
                return $sanitize(marked($scope.post.content || ''));
            } catch(e) {
                return '<h1 class=\"text-danger\">Parsing Error</h1>';
            }
        };

        $scope.cancel = function() {
            if($scope.upload)
                $scope.upload.abort();
            $state.go('admin.blog');
        };

        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            var file = $files[0];

            if(!file) {
                $scope.filename = null;
                $scope.fileToUpload = null;
            } else {
                $scope.filename = file.name;
                $scope.fileToUpload = file;
            }
        };

        $scope.savePost = function(form) {
            $scope.submitted = true;
            console.log(form);

            if(form.$valid) {
                if(!$scope.newPost && ($scope.filename === $scope.post.imageId || $scope.filename === null)) {
                    $scope.upload = $upload.upload({
                        url: 'api/posts/'+$scope.post._id,
                        method: 'PUT',
                        data: $scope.post
                    })
                        .progress(function(evt) {
                            $scope.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
                        })
                        .success(function(data, status) {
                            $scope.progress = undefined;
                            console.log(status);
                            console.log(data);
                            $state.go('admin.blog');
                        })
                        .error(function(response, status) {
                            $scope.progress = undefined;
                            console.log(status);
                            console.log(response);
                        })
                        .xhr(function(xhr) {
                            $scope.abort = function() {
                                xhr.abort();
                            };
                        });
                } else if(!$scope.newPost) {
                    var updated = $scope.post;
                    updated.newImage = true;
                    $scope.upload = $upload.upload({
                        url: 'api/posts/'+$scope.post._id,
                        method: 'PUT',
                        file: $scope.fileToUpload,
                        data: updated
                    })
                        .progress(function(evt) {
                            $scope.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
                        })
                        .success(function(data, status) {
                            $scope.progress = undefined;
                            console.log(status);
                            console.log(data);
                            $state.go('admin.blog');
                        })
                        .error(function(response, status) {
                            $scope.progress = undefined;
                            console.log(status);
                            console.log(response);
                        })
                        .xhr(function(xhr) {
                            $scope.abort = function() {
                                xhr.abort();
                            };
                        });
                } else {
                    $scope.upload = $upload.upload({
                        url: 'api/posts',
                        method: 'POST',
                        file: $scope.fileToUpload,
                        data: $scope.post
                    })
                        .progress(function(evt) {
                            $scope.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
                            console.log(evt);
                        })
                        .success(function(data, status) {
                            $scope.progress = undefined;
                            console.log(status);
                            console.log(data);
                            $state.go('admin.blog');
                        })
                        .error(function(response, status) {
                            $scope.progress = undefined;
                            console.log(status);
                            console.log(response);
                        })
                        .xhr(function(xhr) {
                            $scope.abort = function() {
                                xhr.abort();
                            };
                        });
                }
            }
        };
    });
