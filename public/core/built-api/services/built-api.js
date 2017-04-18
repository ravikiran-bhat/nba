	'use strict';
	var BuiltApi = require('built_modules/built-api');
	var headers = {};

	//Get Headers
	function getHeaders(args) {
		if (args && !_.isEmpty(args.headers))
			return _.extend(args.headers, headers)

		return headers;
	}

	function setHeaders(args_headers) {
		headers = _.extend(headers, args_headers);
	}

	function removeHeaderKey(key) {
		delete headers[key];
	}

	function removeHeaders() {
		headers = {}
	}

	module.exports = [
	'$q',
	function($q) {
		return {
				// Set headers
				setHeaders: setHeaders,
				// Remove specific header key
				removeHeaderKey: removeHeaderKey,
				// Remove all headers
				removeHeaders: removeHeaders,
				// Get headers
				getHeaders: getHeaders,
				//HostConfig service
				HostConfig: {
					getHostConfig: function() {
						return $q.when(BuiltApi.HostConfig.getHostConfig());
					}
				},
				// FieldTypes service
				FieldTypes: {
					getDataTypes: function() {
						return $q.when(BuiltApi.FieldTypes.getDataTypes());
					}
				},

				// User session service
				UserSession: {
					login: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.UserSession.login(args));
					},
					get: function() {
						return $q.when(BuiltApi.UserSession.get());
					},
					logout: function() {
						return $q.when(BuiltApi.UserSession.logout());
					},
					postForgotPassword: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.UserSession.postForgotPassword(args));
					},
					signUp: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.UserSession.signUp(args));
					},
					update: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.UserSession.update(args));
					},
					resetPassword: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.UserSession.resetPassword(args));
					},
					activateAccount: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.UserSession.activateAccount(args));
					},
					checkUserRestriction: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.UserSession.checkUserRestriction(args));
					}

				},
				
				// Application Service
				Application: {
					getApps: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Application.getApps(args));
					},
					getApp: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Application.getApp(args));
					},
					addOne: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Application.addOne(args));
					},
					editOne: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Application.editOne(args));
					},
					deleteOne: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Application.deleteOne(args));
					},
					transferOwnerShip: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Application.transferOwnerShip(args));
					},
					ownershipActivation: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Application.ownershipActivation(args));
					},
					getAppSettings: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Application.getAppSettings(args));
					},
					postAppSettings: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Application.postAppSettings(args));
					},
					Collaborators: {
						getPermissions: function(args){
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Application.Collaborators.getPermissions(args));
						}
					},
					SystemRoles: {
						getOne: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.SystemRoles.getOne(args));
						},
						getAll: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.SystemRoles.getAll(args));
						},
						addOne: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.SystemRoles.addOne(args));
						},
						editOne: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.SystemRoles.editOne(args));
						},
						deleteOne: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.SystemRoles.deleteOne(args));
						},
						setBulkACL: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.SystemRoles.setBulkACL(args));
						}
					}
				},
				
				// Devices Service
				Devices: {
					getDevicesClass: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Devices.getDevicesClass(args));
					},
					editDevicesClass: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Devices.editDevicesClass(args));
					},
					getDevice: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Devices.getDevice(args));
					},
					getAllDevices: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Devices.getAllDevices(args));
					},
					postGetAllDevices: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Devices.postGetAllDevices(args));
					},
					createDevice: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Devices.createDevice(args));
					},
					deleteDevice: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Devices.deleteDevice(args));
					},
					deleteSelectedDevices: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Devices.deleteSelectedDevices(args));
					},
					updateDevice: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Devices.updateDevice(args));
					}
				},
				
				//Credentials Services
				Credentials: {
					getDetails: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Credentials.getDetails(args));
					}
				},
				// Notifications Services
				Notifications: {
					getAll: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Notifications.getAll(args));
					},
					getOne: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Notifications.getOne(args));
					}, 
					addOne: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Notifications.addOne(args));
					},
					editOne: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Notifications.editOne(args));
					},
					deleteOne: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Notifications.deleteOne(args));
					},
					deleteSelected: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Notifications.deleteSelected(args));
					}
				},
				Templates: {
					getAll: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Templates.getAll(args));
					},
					getOne: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Templates.getOne(args));
					},
					postGetAll: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Templates.postGetAll(args));
					},
					update: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Templates.update(args));
					},
					create: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Templates.create(args));
					},
					deleteOne: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Templates.deleteOne(args));
					},
					deleteSelected: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Templates.deleteSelected(args));
					}
				},
				UIConfig: {
					getUIConfig: function() {
						return $q.when(BuiltApi.UIConfig.getUIConfig());
					}
				},
				Plans: {
					getPlans: function() {
						return $q.when(BuiltApi.Plans.getPlans());
					}
				},
				ApiMetrics: {
					get: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.ApiMetrics.get(args));
					}
				},
				UserMetrics: {
					get: function(args){
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.UserMetrics.get(args));
					}
				},
				Accounts: {
					getAccounts: function() {
						return $q.when(BuiltApi.Accounts.getAccounts());
					},
					getBillingInfo: function() {
						return $q.when(BuiltApi.Accounts.getBillingInfo());
					},
					getPaymentHistory: function() {
						return $q.when(BuiltApi.Accounts.getPaymentHistory());
					},
					postPlans: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Accounts.postPlans(args));
					}
				},
				Analytics: {
					getEvents: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Analytics.getEvents(args));
					},
					getPropAnalytics: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Analytics.getPropAnalytics(args));
					},
					editEvents: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Analytics.editEvents(args));
					},
					deleteEvents: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Analytics.deleteEvents(args));
					},
					getAnalytics: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Analytics.getAnalytics(args));
					},
					postAnalytics: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Analytics.postAnalytics(args));
					},
					deleteFunnel: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Analytics.deleteFunnel(args));
					},
					addFunnel: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Analytics.addFunnel(args));
					},
					editFunnel: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Analytics.editFunnel(args));
					},
					deleteBookmarkSegment: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Analytics.deleteBookmarkSegment(args));
					},
					updateBookmarkSegment: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Analytics.updateBookmarkSegment(args));
					}
				},
				Groups: {
          getOne: function(args) {
            var args = args || {};
            args.headers = getHeaders(args);
            return $q.when(BuiltApi.Groups.get(args));
          },
          getAll: function(args) {
            var args = args || {};
            args.headers = getHeaders(args);
            return $q.when(BuiltApi.Groups.getAll(args));
          },
          delete: function(args) {
            var args = args || {};
            args.headers = getHeaders(args);
            return $q.when(BuiltApi.Groups.delete(args));
          },
          deleteAll: function(args) {
            var args = args || {};
            args.headers = getHeaders(args);
            return $q.when(BuiltApi.Groups.deleteAll(args));
          },
          update: function(args) {
            var args = args || {};
            args.headers = getHeaders(args);
            return $q.when(BuiltApi.Groups.update(args));
          },
          add: function(args) {
            var args = args || {};
            args.headers = getHeaders(args);
            return $q.when(BuiltApi.Groups.add(args));
          }
        },

				// Super Admin Service
				Admin: {
					login: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.login(args));
					},
					logout: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.logout(args));
					},
					getUserCode:function(args){
						var args = args || {}
						return $q.when(BuiltApi.Admin.getUserCode(args));
					},
					getAdminMetrics: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.getAdminMetrics(args));
					},
					getUserMetrics: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.getUserMetrics(args));
					},
					getAdminConfig: function() {
						return $q.when(BuiltApi.Admin.getAdminConfig());
					},
					getAdminSettings: function() {
						return $q.when(BuiltApi.Admin.getAdminSettings());
					},
					postAdminSettings: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.postAdminSettings(args));
					},
					getPromoCodes: function() {
						return $q.when(BuiltApi.Admin.getPromoCodes());
					},
					editPromoCode: function(args) {
						return $q.when(BuiltApi.Admin.editPromoCode(args));
					},
					deletePromoCode: function(args) {
						return $q.when(BuiltApi.Admin.deletePromoCode(args));
					},
					postPromoCode: function(args) {
						return $q.when(BuiltApi.Admin.postPromoCode(args));
					},
					getPlans: function() {
						return $q.when(BuiltApi.Admin.getPlans());
					},
					editPlans: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.editPlans(args));
					},
					deletePlans: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.deletePlans(args));
					},
					postPlans: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.postPlans(args));
					},
					getDomains: function() {
						return $q.when(BuiltApi.Admin.getDomains());
					},
					editDomains: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.editDomains(args));
					},
					deleteDomains: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.deleteDomains(args));
					},
					postDomains: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.postDomains(args));
					},
					getCron: function() {
						return $q.when(BuiltApi.Admin.getCron());
					},
					getPredefinedCron: function() {
						return $q.when(BuiltApi.Admin.getPredefinedCron());
					},
					deleteCron: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.deleteCron(args));
					},
					postCron: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.postCron(args));
					},
					Analytics: {
						processBulkTriggers: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.Analytics.processBulkTriggers(args));
						}
					},
					Organisations: {
						getAll: function(args) {
							return $q.when(BuiltApi.Admin.Organisations.getAll());
						},
						getOne: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.Organisations.getOne(args));
						},
						addOne: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.Organisations.addOne(args));
						},
						editOne: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.Organisations.editOne(args));
						},
						deleteOne: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.Organisations.deleteOne(args));
						}
					},
					getTrials: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.getTrials(args));
					},
					postTrial: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.postTrial(args));
					},
					editTrial: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.editTrial(args));
					},
					deleteTrial: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.deleteTrial(args));
					},
					getMails: function(args) {
						return $q.when(BuiltApi.Admin.getMails());
					},
					postMail: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.postMail(args));
					},
					editMail: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.editMail(args));
					},
					deleteMail: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.deleteMail(args));
					},
					getMailLogs: function(args){
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.getMailLogs(args));
					},
					postUserConfigurations: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.postUserConfigurations(args));
					},
					getUserConfigurations: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.getUserConfigurations(args));
					},
					updateUserConfig: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.updateUserConfig(args));
					},
					resendActivationMail: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.resendActivationMail(args));
					},
					getPermittedRegistrations: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.getPermittedRegistrations(args));
					},
					editPermittedRegistrations: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.editPermittedRegistrations(args));
					},
					deletePermittedRegistrations: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.deletePermittedRegistrations(args));
					},
					addPermittedRegistrations: function(args) {
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.addPermittedRegistrations(args));
					},
					applications: {
						getExportRequests: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.getExportRequests(args));
						},
						approveExportRequest: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.approveExportRequest(args));
						},
						rejectExportRequest: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.rejectExportRequest(args));
						},
						deleteExportRequest: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.deleteExportRequest(args));
						},
						getImportRequests: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.getImportRequests(args));
						},
						approveImportRequest: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.approveImportRequest(args));
						},
						rejectImportRequest: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.rejectImportRequest(args));
						},
						deleteImportRequest: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.deleteImportRequest(args));
						}
					},
					cronJobs: {
						invokeAccountant: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.invokeAccountant(args));
						},
						invokeAllAccountant: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.invokeAllAccountant(args));
						}
					},
					Mails : {
						mailsLogs: function(args) {
							var args = args || {};
							args.headers = getHeaders(args);
							return $q.when(BuiltApi.Admin.mailsLogs(args));
						}
					},
					getDeploymentInfo: function(args){
						var args = args || {};
						args.headers = getHeaders(args);
						return $q.when(BuiltApi.Admin.getDeploymentInfo(args));
					}
				}
			}
		}
		]