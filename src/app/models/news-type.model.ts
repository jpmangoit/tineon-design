import { SafeUrl } from "@angular/platform-browser"
import { UserDetails } from "./login-details.model"

export interface NewsType {
  approved_status: number
  attachment: string
  audience: number
  author: number
  created_at: string
  guests: number
  groups:GroupsDetail[]
  headline: string
  id: number
  imageUrls: any
  priority: number
  publication_date_from:string
  publication_date_to:string
  show_guest_list: string
  is_highlighted: string
  tags: string
  team_id: number
  text: string
  title: string
  updated_at: string
  user: NewsUsers
  updated_record:string
  deny_by_id:number
  deny_reason:string
  news_image:any
}

export interface NewsUsers{
  bd_notification: Date
  created_at: string
  email: string
  firstname: string
  id:  number
  image:SafeUrl
  keycloak_id: string
  lastname: string
  member_id: number
  role: string
  share_birthday: 1
  team_id: number
  username: string
}

export interface GroupsDetail{
  group: GroupInfo
  group_id: number
  id: number
  news_id:number
}
export interface GroupInfo{
  approved_status: number
  created_at: string
  created_by: number
  description: string
  id: number
  image:string
  name: string
  team_id: number
  updated_at: string
}

