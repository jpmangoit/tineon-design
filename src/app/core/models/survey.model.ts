export interface Survey {
  additional_anonymous_voting: boolean
  additional_cast_vote: boolean
  created_at: string
  description: string
  id: number
  surveyAnswer: {id:number, surveyId: number, surveyAnswer: string}
  surveyEndDate: string
  surveyNotificationOption: string[]
  surveyOption: number
  surveyStartDate: string
  surveyType: string
  surveyViewOption: number
  survey_status: number
  survey_type:SurveyType
  team_id: number
  title: string
  updated_at: string
  user_id: number
  user_name: any
}

export interface SurveyType{
  id: number,
  surveyId: number,
  surveyType: string,
  surveyTypeId: number[],
  survey_group: {id: number, name: string}
}

export interface VoteSetting{
  id: number
  surveyAnswerId: string
  surveyId: number
  surveyType: string
  surveyTypeId: number[]
  team_id: Number
  user_details: {id: number, firstname: string, lastname: string}
  user_id: number
}

export interface VoteAnswer{
  id: number
  surveyAnswerId: number
  surveyId: number
  surveyType: string
  surveyTypeId: number[]
  team_id: number
  user_details: {id: number, firstname: string, lastname: string}
  user_id: number
}




export interface CRM_Survey{
  TotalVoteCount:number
  additional_anonymous_voting: "false"
  additional_cast_vote: "false"
  author: string
  author_id:number
  created_at: string
  description: string
  id: number
  month: string
  status: number
  surveyAnswerOption: CRM_surveyAnswerOption[]
  survey_end_date: string
  survey_notification_option:string[]
  survey_start_date: string
  survey_type: string
  survey_view_option:number
  title: string
  votes: CRM_Votes
  votingOption: number
}

export interface CRM_surveyAnswerOption{
  answerId: number
  id: number
  per: number
  survey_answer:string
  survey_id:number
  votedUsers:  {user_id: string, tineon_user_id:number, voterName: string}[]
  length: 1
  votedUsersCount:number
}

export interface CRM_Votes {
  id: number
  survey_answer_id:number
  survey_id:number
  survey_type: string
  tineon_user_id:number
  user_id: string
}
