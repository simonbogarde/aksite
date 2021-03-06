'use strict';

angular.module('aksiteApp')
    .controller('SettingsDashboardCtrl', function($scope, Auth, $mdToast) {
        $scope.changePassword = function(form) {
            $scope.submitted = true;
            if(form.$valid) {
                Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
                    .then(function() {
                        $scope.showSimpleToast('Password Updated');
                    })
                    .catch(function() {
                        $scope.userForm.oldPassword.$setValidity('wrongPassword', false);
                    });
            }
        };

        $scope.showSimpleToast = function(text) {
            $mdToast.show(
                $mdToast.simple()
                    .content(text)
                    .position('bottom right')
                    .hideDelay(3000)
            );
        };
    });
