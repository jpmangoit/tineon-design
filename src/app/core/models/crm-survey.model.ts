export interface CrmSurvey {
  isError: boolean
  result: any

  additional_anonymous_voting: boolean
  additional_cast_vote: boolean
  author: string
  author_id: number
  created_at: string
  description: string
  id: number
  status:number
  survey_end_date: string
  survey_notification_option: []
  survey_start_date: string
  survey_type: string
  survey_view_option: number
  title: string
  votingOption: number
}
