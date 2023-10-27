import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {ClubDetail, LoginDetails, ProfileDetails, TaskCollaboratorDetails, ThemeType} from '@core/models';
import {Subscription} from 'rxjs';
import {AuthServiceService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {ConfirmDialogService, DenyReasonConfirmDialogService, UpdateConfirmDialogService} from '@shared/components';

declare var $: any;


@Component({
	selector: 'app-morganizer-task-details',
	templateUrl: './morganizer-task-details.component.html',
	styleUrls: ['./morganizer-task-details.component.css']
})
export class MorganizerTaskDetailsComponent implements OnInit, OnDestroy {
	language: any;
	displayError: boolean;
	userDetails: LoginDetails;
	setTheme: ThemeType;
	// taskDetails: TaskType[] = [];
	taskDetails: any = [];
	getclubInfo: ClubDetail;
	birthdateStatus: boolean;
	collaboratorDetails: TaskCollaboratorDetails[] = [];
	profile_data: ProfileDetails;
	memberStartDateStatus: Date;
	thumbnail: SafeUrl;
	thumb: SafeUrl;
	organizerDetails: any[] = [];
	collaborators: any[] = [];
	count: number = 0;
	updatedTaskData: any;
	UpdatedcollaboratorDetails: any[] = [];
	updatedOrganizerDetails: any[] = [];
	updatedCollaborators: any[] = [];
	task_id: number;
	subtaskCompleteStatus: number = 0;
	private activatedSub: Subscription;
	private refreshPage: Subscription
	private denyRefreshPage: Subscription
	private removeUpdate: Subscription
	allUsers: any;
	taskId: number;
	alluserInformation: { member_id: number }[] = [];
	selectedSubtask: any;

	constructor(
		private authService: AuthServiceService,
		private router: Router,
		private route: ActivatedRoute,
		private themes: ThemeService,
		private updateConfirmDialogService: UpdateConfirmDialogService,
		private confirmDialogService: ConfirmDialogService,
		private lang: LanguageService,
		private denyReasonService: DenyReasonConfirmDialogService,
		private notificationService: NotificationService,
		private commonFunctionService: CommonFunctionService,
		private sanitizer: DomSanitizer

	) {
		this.refreshPage = this.confirmDialogService.dialogResponse.subscribe(message => {
			setTimeout(() => {
				this.ngOnInit();
			}, 2000);
		});
		this.denyRefreshPage = this.updateConfirmDialogService.denyDialogResponse.subscribe(resp => {
			setTimeout(() => {
				this.ngOnInit();
			}, 2000);
		});
		this.removeUpdate = this.denyReasonService.remove_deny_update.subscribe(resp => {
			setTimeout(() => {
				this.ngOnInit();
			}, 1000);
		})
	}

	ngOnInit(): void {
		if (localStorage.getItem('club_theme') != null) {
			let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
			this.setTheme = theme;
		}
		this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
			this.setTheme = resp;
		});
		this.userDetails = JSON.parse(localStorage.getItem('user-data'));
		this.language = this.lang.getLanguageFile();
		this.route.params.subscribe(params => {
			const taskid: number = params['taskid'];
			this.taskId = params['taskid'];
			this.getAllUserInfo();
		});
	}

	/**
   * Function to get all the Club Users
   * @author  MangoIt Solutions
   * @param   {}
   * @return  {Array Of Object} all the Users
   */
	getAllUserInfo() {
		this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
			.subscribe(
				(respData: any) => {
					if (respData && respData.length > 0) {
						this.allUsers = respData;
						Object(respData).forEach((val, key) => {
							this.alluserInformation[val.id] = { member_id: val.member_id };
						})
					}
					this.getTaskDetails(this.taskId);
				}
			);
	}

	/**
	  * Function to get a task detail
	* @author  MangoIt Solutions
	* @param   {taskid}
	* @return  {Array Of Object} all the Users
	*/
	getTaskDetails(taskid: number) {
		if (sessionStorage.getItem('token')) {
			this.authService.setLoader(true);
			this.authService.memberSendRequest('get', 'get-task-by-id/' + taskid, null)
				.subscribe(
					(respData: any) => {
						this.authService.setLoader(false);
						this.taskDetails = null;
						if (respData['isError'] == false) {
							if (respData && respData['result'] && respData['result'][0]) {
								this.taskDetails = respData['result'][0];
								if (this.alluserInformation[this.taskDetails.userstask.id] != null) {
									this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[this.taskDetails.userstask.id].member_id, null)
										.subscribe(
											(resppData: any) => {
												this.thumb = resppData;
												this.taskDetails.userstask.userImage = this.thumb;
											},
											(error: any) => {
												this.taskDetails.userstask.userImage = null;
											});
								} else {
									this.taskDetails.userstask.userImage = null;
								}
								if (this.taskDetails?.['task_image'][0]?.['task_image']) {
									this.taskDetails['task_image'][0]['task_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.taskDetails['task_image'][0]?.['task_image'].substring(20)));
								}

								let cudate: Date = new Date();
								this.taskDetails.dayCount = this.commonFunctionService.getDays(cudate, this.taskDetails.date);
								if (this.taskDetails.date.split('T')[0] > cudate.toISOString().split('T')[0]) {
									this.taskDetails.remain = this.language.Survey.day_left;
								} else {
									this.taskDetails.remain = this.language.organizer_task.daysOverride;
								}

								if (this.taskDetails) {
									this.getOrganizerDetails(taskid);
								}

								this.taskDetails.approvedCount = 0;
								this.taskDetails.progressVal = 0;
								if (this.taskDetails['subtasks']?.length > 0) {

									this.taskDetails.approvedCount = this.taskDetails.subtasks.filter((obj: any) => obj.status === 1).length
									this.taskDetails.progressVal = Math.round(100 * (this.taskDetails.approvedCount / (this.taskDetails.subtasks.length)));

									this.taskDetails['subtasks'].forEach(element => {
										element.assigned_to = JSON.parse(element.assigned_to);
										if (element.assigned_to.length > 0) {
											element.assigned_to.forEach(elem => {
												if (this.allUsers?.length > 0) {
													this.allUsers.forEach(el => {
														if (el.id == elem.user_id) {
															elem.user = el;
															if (elem.user.member_id != null) {
																this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + elem.user.member_id, null)
																	.subscribe(
																		(resppData: any) => {
																			elem.user.image = resppData
																		},
																		(error: any) => {
																			elem.user.image = null;
																		}
																	);
															} else {
																elem.user.image = null;
															}

														}
													});
												}
											});
										}
									});
								}
								if (this.taskDetails['organizer_id'] == this.userDetails.userId || this.userDetails.roles[0] == 'admin') {
									this.UpdatedcollaboratorDetails = [];
									this.updatedCollaborators = [];
									this.UpdatedcollaboratorDetails = [];
									this.updatedTaskData = null;
									if (this.taskDetails['updated_record'] != null && this.taskDetails['updated_record'] != "") {
										this.updatedTaskData = JSON.parse(this.taskDetails?.['updated_record']);
									}
									if (this.updatedTaskData != null) {

										if (this.updatedTaskData?.file != 'undefined' && this.updatedTaskData?.file != '' && this.updatedTaskData?.file != null) {
											this.updatedTaskData.file = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.updatedTaskData.file.substring(20)));
										}
										this.updatedTaskData.subtasks = JSON.parse(this.updatedTaskData?.subtasks);

										this.updatedTaskData.approvedCount = 0;
										this.updatedTaskData.progressVal = 0;
										if (this.updatedTaskData.subtasks.length > 0) {
											this.updatedTaskData.approvedCount = this.updatedTaskData.subtasks.filter((obj: any) => obj.status === 1).length
											this.updatedTaskData.progressVal = Math.round(100 * (this.updatedTaskData.approvedCount / (this.updatedTaskData.subtasks.length)));
										}
										let cudate: Date = new Date();
										this.updatedTaskData.dayCount = this.commonFunctionService.getDays(cudate, this.updatedTaskData.date);
										if (this.updatedTaskData.date.split('T')[0] > cudate.toISOString().split('T')[0]) {
											this.updatedTaskData.remain = this.language.Survey.day_left;
										} else {
											this.updatedTaskData.remain = this.language.organizer_task.daysOverride;
										}

										this.updatedTaskData.collaborators = JSON.parse(this.updatedTaskData.collaborators);
										if (this.updatedTaskData['subtasks'] && this.updatedTaskData['subtasks'].length > 0) {
											if (this.updatedTaskData && this.updatedTaskData['subtasks'].length > 0) {
												this.updatedTaskData['subtasks'].forEach(element => {
													if (element.assigned_to) {
														element.assigned_to.forEach(elem => {
															if (this.allUsers?.length > 0) {
																this.allUsers.forEach(el => {
																	if (el.id == elem.user_id) {
																		elem.user = el;
																		if (elem.user.member_id != null) {
																			this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + elem.user.member_id, null)
																				.subscribe(
																					(resppData: any) => {
																						this.thumb = resppData;
																						elem.user.image = this.thumb
																					},
																					(error: any) => {
																						elem.user.image = null;
																					});
																		} else {
																			elem.user.image = null;
																		}
																	}
																});
															}
														});
													}
												});
											}
										}
										if (this.updatedTaskData && this.updatedTaskData.collaborators.length > 0) {
											this.updatedTaskData.collaborators.forEach(element => {
												this.UpdatedcollaboratorDetails.push(element);
												if (this.UpdatedcollaboratorDetails) {
													if (this.UpdatedcollaboratorDetails && this.UpdatedcollaboratorDetails.length > 0) {
														this.UpdatedcollaboratorDetails.forEach(elem => {
															if (this.allUsers?.length > 0) {
																this.allUsers.forEach(el => {
																	if (el.id == elem.user_id) {
																		elem.user = el;
																		if (elem.user.member_id != null) {
																			this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + elem.user.member_id, null)
																				.subscribe(
																					(resppData: any) => {
																						this.thumb = resppData;
																						elem.user.image = this.thumb
																					},
																					(error: any) => {
																						elem.user.image = null;
																					});
																		} else {
																			elem.user.image = null;
																		}
																	}
																});
															}
														});
													}
												}
											});
										}

										let org_id = 0;
										this.updatedOrganizerDetails = [];
										if (this.UpdatedcollaboratorDetails && this.UpdatedcollaboratorDetails.length > 0) {
											this.UpdatedcollaboratorDetails.forEach((value: any) => {
												if (value.user_id == this.updatedTaskData['organizer_id']) {
													this.updatedOrganizerDetails.push(value);
													org_id = 1;
												} else {
													this.updatedCollaborators.push(value);
												}
											})
										}
										this.updatedOrganizerDetails = Object.assign(this.authService.uniqueObjData(this.updatedOrganizerDetails, 'id'));
										this.updatedCollaborators = Object.assign(this.authService.uniqueObjData(this.updatedCollaborators, 'id'));

									}
								}
							}
						} else if (respData['code'] == 400) {
							this.notificationService.showError(respData['message'], null);
						}
					}
				);
		}
	}

	showUpdatedData: boolean = true;
	getSubTasksDetails(subtaskId: number, mode: any) {
		if (mode === 'updated') {
			this.showUpdatedData = true;
		} else {
			this.showUpdatedData = false;
		}
		// this.selectedSubtask = '';
		this.selectedSubtask = this.taskDetails?.subtasks.find((subtask) => subtask.id === subtaskId);
	}

	/**
	* Function to get the details of the organizer of the task
	* @author  MangoIt Solutions
	* @param   {groupId, Group Name}
	* @return  {}
	*/
	getOrganizerDetails(taskid: number) {
		if (sessionStorage.getItem('token')) {
			this.organizerDetails = [];
			this.collaborators = [];
			this.collaboratorDetails = []
			this.authService.setLoader(true);
			this.authService.memberSendRequest('get', 'getTaskCollaborator/task/' + taskid, null)
				.subscribe(
					(respData: any) => {
						this.authService.setLoader(false);
						if (respData && respData.length > 0) {
							this.collaboratorDetails = respData;
							var org_id = 0;
							Object(this.collaboratorDetails).forEach((val, key) => {
								if (val.user && val.user.length > 0) {
									val.user.forEach(element => {
										if (element.member_id != null) {
											this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + element.member_id, null)
												.subscribe((resppData: any) => {
													this.thumb = resppData;
													val.image = this.thumb
												},
													(error: any) => {
														val.image = null;
													});
										} else {
											val.image = null;
										}
									});
								}
								if (val.user_id == this.taskDetails['organizer_id']) {
									this.organizerDetails.push(val)
									org_id = 1;
								} else {
									this.collaborators.push(val);
								}
							});
							this.organizerDetails = Object.assign(this.authService.uniqueObjData(this.organizerDetails, 'id'));
							this.collaborators = Object.assign(this.authService.uniqueObjData(this.collaborators, 'id'));
						}
					}
				);
		}
	}

	/**
  * Function to approve task by Admin
  * @author  MangoIt Solutions
  * @param   {taskId}
  * @return  {}
  */
	adminApprovedTasks(taskId: number) {
		this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_task, function () {
			this.authService.memberSendRequest('get', 'approve-task-as-admin/' + taskId + '/approvedby/' + this.userDetails.userId, null)
				.subscribe(
					(respData: any) => {
						this.ngOnInit();
					}
				)
		}, function () {
		})
	}

	/**
	* Function to approve updated task by Admin
	* @author  MangoIt Solutions
	* @param   {taskId}
	* @return  {}
	*/
	adminApprovedUpdateTasks(taskId: number) {
		this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_task, function () {
			this.authService.memberSendRequest('get', 'approve-updatedtask/' + taskId + '/approvedby/' + this.userDetails.userId, null)
				.subscribe(
					(respData: any) => {
						this.ngOnInit();
					}
				)
		}, function () {
		})
	}

	/**
	* Function to Unapprove task by Admin
	* @author  MangoIt Solutions
	* @param   {taskId}
	* @return  {}
	*/
	adminUnapprovedTasks(taskId: number) {
		this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_task, function (reason) {
			let postData = {
				"deny_reason": reason,
				"deny_by_id": this.userDetails.userId
			};
			this.authService.memberSendRequest('put', 'deny-task/task_id/' + taskId, postData)
				.subscribe(
					(respData: any) => {
						this.ngOnInit();
						this.router.navigate(['mobile/morganizer-task-detail/' + taskId])
						// this.router.navigate(['mobile/task-detail/' + taskId])
					}
				)
		}, function () {
		})
	}

	/**
   * Function for delete the Task
   * @author  MangoIt Solutions
   * @param   {taskId}
   * @return  {}
   */
	deleteTask(eventId: number) {
		this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_task, function () {
			this.authService.setLoader(true);
			this.authService.memberSendRequest('delete', 'DeleteTask/' + eventId, null)
				.subscribe(
					(respData: any) => {
						this.authService.setLoader(false);
						this.notificationService.showSuccess(respData.result.message, null);
						const url: string[] = ["/mobile/organizer/organizer-task"];
						this.router.navigate(url);
					}
				)
		}, function () {
			$('.dropdown-toggle').trigger('click');
		})
	}

	/**
	* Function for delete the updated Task
	* @author  MangoIt Solutions
	* @param   {taskId}
	* @return  {}
	*/
	deleteUpdateTask(task_id: number) {
		this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_task, function () {
			this.authService.memberSendRequest('get', 'get-reset-updatedtask/' + task_id, null)
				.subscribe(
					(respData: any) => {
						setTimeout(() => {
							this.ngOnInit()
							this.router.navigate(['mobile/morganizer-task-detail/' + task_id])
							// this.router.navigate(['mobile/task-detail/' + task_id])
						}, 1000);
					}
				)
		}, function () {
		}, 'deleteUpdate')
	}

	/**
 * Function for the completion of Subtask
 * @author  MangoIt Solutions
 * @param   {subTaskid}
 * @return  {}
 */
	eventMarkComplete(subtaskId: number) {
		if (this.taskDetails['subtasks'] && this.taskDetails['subtasks'].length > 0) {
			this.taskDetails['subtasks'].forEach(element => {
				if (element.id == subtaskId) {
					if (element.assigned_to && element.assigned_to.length > 0) {
						element.assigned_to.forEach(elem => {
							if (elem.user_id == this.userDetails.userId || this.taskDetails['organizer_id'] == this.userDetails.userId ||
								this.userDetails.roles[0] == 'admin') {
								this.count = 1;
							} else {
								if (this.collaborators && this.collaborators.length > 0) {
									this.collaborators.forEach((el: any) => {
										if (el.user_id == this.userDetails.userId) {
											this.count = 1
										}
									})
								}
							}
						});
					}

					if (this.count == 1) {
						this.confirmDialogService.confirmThis(this.language.confirmation_message.complete_task,
							function () {
								this.authService.memberSendRequest('get', 'complete-subtask-by-id/' + subtaskId, null).subscribe(
									(respData: any) => {
										this.collaboratorDetails = [];
										this.ngOnInit();
									}
								)
							}, function () {
								$('#styled-checkbox-' + subtaskId).prop('checked', false);
							})
						this.count = 0;
					} else {
						$('#styled-checkbox-' + subtaskId).prop('checked', false);
						$('#subtask2').modal('toggle');
					}
				}
			});
		}
	}

	eventMarkCompleteSub(subtaskId: number) {
		if (this.taskDetails['subtasks'] && this.taskDetails['subtasks'].length > 0) {
			this.taskDetails['subtasks'].forEach(element => {
				if (element.id == subtaskId) {
					if (element.assigned_to && element.assigned_to.length > 0) {
						element.assigned_to.forEach(elem => {
							if (elem.user_id == this.userDetails.userId || this.taskDetails['organizer_id'] == this.userDetails.userId ||
								this.userDetails.roles[0] == 'admin') {
								this.count = 1;
							} else {
								if (this.collaborators && this.collaborators.length > 0) {
									this.collaborators.forEach((el: any) => {
										if (el.user_id == this.userDetails.userId) {
											this.count = 1
										}
									})
								}
							}
						});
					}
					if (this.count == 1) {
						this.confirmDialogService.confirmThis(
							this.language.confirmation_message.complete_task,
							() => {
								this.authService.memberSendRequest('get', 'complete-subtask-by-id/' + subtaskId, null).subscribe(
									(respData: any) => {
										this.collaboratorDetails = [];
										this.ngOnInit();
									}
								);
							},
							() => {
								$('input[type="checkbox"]').prop('checked', false);
								// $('#styled-checkbox-' + subtaskId).prop('checked', false); // Uncheck the checkbox
							},
							subtaskId // Pass subtaskId to the callbacks
						);
						this.count = 0;
					} else {
						$('#styled-checkbox-' + subtaskId).prop('checked', false);
						$('#subtask2').modal('toggle');
					}
				}
			});
		}
	}

	/**
	* Function for the completion of Main Task
	* @author  MangoIt Solutions
	* @param   {taskId}
	* @return  {}
	*/
	mainTaskMarkComplete(taskId: number) {
		this.task_id = taskId;
		var subtaskStatus: number = 0;
		if (this.taskDetails['id'] == taskId) {
			this.authService.memberSendRequest('get', 'getTaskCollaborator/task/' + taskId, null).subscribe((respData: any) => {
				if (respData && respData.length > 0) {
					respData.forEach(ele => {
						if (ele.user_id == this.userDetails.userId) {
							this.count = 1;
						}
					});
				}
			});
			setTimeout(() => {
				if (this.taskDetails['organizer_id'] == this.userDetails.userId || this.userDetails.roles[0] == 'admin' || this.count == 1) {
					if (this.taskDetails['subtasks'] && this.taskDetails['subtasks'].length > 0)
						this.taskDetails['subtasks'].forEach(element => {
							if (element.status == 0) {
								subtaskStatus = 1;
							}
						});
					if (subtaskStatus == 0) {
						this.confirmDialogService.confirmThis(this.language.confirmation_message.complete_task, function () {
							this.authService.setLoader(true);
							this.authService.memberSendRequest('get', 'approveTaskById/task/' + taskId, null).subscribe(
								(respData: any) => {
									this.authService.setLoader(false);
									if (respData['isError'] == false) {
										this.notificationService.showSuccess(respData['result'], null);
										this.ngOnInit();
									} else if (respData['code'] == 400) {
										this.notificationService.showError(respData['message'], null);
									}
								}
							)
						}, function () {
							$('#styled-checkbox-' + taskId).prop('checked', false);
						})
					} else {
						$('#styled-checkbox-' + taskId).prop('checked', false);
						$('#subtask').modal('toggle');
					}
				} else {
					$('#styled-checkbox-' + taskId).prop('checked', false);
					$('#subtask1').modal('toggle');
				}
			}, 100);
		}
	}

	/**
	* Function to check subtask completion
	* @author  MangoIt Solutions
	* @param   {subtask detail}
	* @return  {boolean} true or false
	*/
	checkStatusToDo(arrayOfObject: any) {
		if (arrayOfObject && arrayOfObject.subtasks && arrayOfObject.subtasks.length > 0) {
			arrayOfObject.subtasks.forEach((element: { status: number; }) => {
				if (element.status == 1) {
					this.subtaskCompleteStatus = 1;
				}
			});
		}
		if (this.subtaskCompleteStatus == 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Function for the get particular users profile Information
	 * @author MangoIt Solutions (M)
	 * @param {user id}
	 * @returns {Object} Details of the User
	 */
	getMemId(id: number) {
		this.thumbnail = '';
		$("#profileSpinner").show();
		this.commonFunctionService.getMemberId(id)
			.then((resp: any) => {
				this.getclubInfo = resp.getclubInfo;
				this.birthdateStatus = resp.birthdateStatus;
				this.profile_data = resp.profile_data
				this.memberStartDateStatus = resp.memberStartDateStatus
				this.thumbnail = resp.thumbnail
				this.displayError = resp.displayError
				$("#profileSpinner").hide();
			})
			.catch((err: any) => {
				console.log(err);
			})
	}



	closeSubtaskModal() {
		$('#subtask2').modal('hide')
	}

	closeModal() {
		$('#subtask').modal('hide')
		$('#styled-checkbox-' + this.task_id).prop('checked', false);
	}

	closeModals() {
		$('#subtask1').modal('hide');
		$('#styled-checkbox-' + this.task_id).prop('checked', false);
	}

	onSubtask2ModalShown() {
		$('#subtaskModal').modal('hide');
		//  $('#styled-checkbox-' + this.task_id).prop('checked', false);
		$('input[type="checkbox"]').prop('checked', false);
	}

	showToggle: boolean = false;
	onShow() {
		let el: HTMLCollectionOf<Element> = document.getElementsByClassName("bunch_drop");
		if (!this.showToggle) {
			this.showToggle = true;
			el[0].className = "bunch_drop show";
		} else {
			this.showToggle = false;
			el[0].className = "bunch_drop";
		}
	}

	goBack() {
		this.router.navigate(['/mobile/organizer/organizer-task']);
	}

	ngOnDestroy(): void {
		this.activatedSub.unsubscribe();
		this.refreshPage.unsubscribe();
		this.denyRefreshPage.unsubscribe();
		this.removeUpdate.unsubscribe();
	}


}
