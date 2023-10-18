export interface Courses {
  CourseExternalInstructor: CourseExternalInstructor
  CourseGroups: []
  CourseInternalInstructor: CourseInternalInstructor
  RoomsDetails: RoomsDetails
  allowed_persons: number
  approved_status: number
  attachments: string
  audience: string
  author: number
  chargeable: number
  coorganizer: string
  courseUsers: courseUsers[]
  create_invoice: string
  created_at: string
  date_from: string
  date_to: string
  description: string
  end_time: number
  date_repeat:string
  group_id: number
  id: number
  instructor_type: number
  invite_friends: string
  limitation_of_participants: number
  link_to_ticket_store: string
  max_on_waiting_list: string
  name: string
  official_club_date: Date
  participants: string
  // picture_video: string
  place: string
  price_per_participant: number
  recurrence: string
  room: number
  schedule: string
  show_guest_list: any
  start_time: number
  tags: string
  team_id: number
  type: string
  updated_at: string
  visibility: number
  waiting_list: string
  course_image: any
  course_document:any
}

export interface CourseExternalInstructor{
  course_id: number
  externalIns: {add_img: string,email: string, first_name: string, id: number, last_name: string, phone_no:number}
  id: number
  instructor_id:Number
}

export interface CourseInternalInstructor{
  course_id: number
  internalUsers: {email: string, first_name: string, id: number, last_name: string, username:string}
  id: number
  user_id:Number
}

export interface RoomsDetails{
  created_at: string
  description: string
  id: number
  image: string
  name: string
  no_of_persons: number
  price: number
  room_type: string
  team_id: number
  updated_at: string
}

export interface courseUsers{
  approved_status:number
  course_id: number
  id: number
  user_id: number
  users:{email: string, firstname: string, id: number,lastname: string, username:string,}
}

