export interface UserAccess {
    admin :userRole;
    editor :userRole;
    functionary :userRole;
    guest :userRole;
    member :userRole;
    secretary :userRole;
    user :userRole;
    member_light :userRole;
    member_light_admin :userRole;

}

export interface userRole{
    authorization: AuthorizationAccess
    create: CreateAccess
    participate:ParticipateAccess
}

export interface AuthorizationAccess{
    appointments:string
    chat:string
    document:string
    event:string
    group:string
    message:string
    news:string
    subtask:string
    task:string
    course:string
    instructor:string
    room:string
    survey:string
    faq:string
    category:string
}

export interface CreateAccess{
    appointments:string
    chat:string
    contact_admin:string
    document:string
    email:string
    event:string
    group:string
    import_calendar:string
    message:string
    news:string
    subtask:string
    task:string
    theme:string
    course:string
    instructor:string
    room:string
    survey:string,
    faq:string
}

export interface ParticipateAccess{
    appointments:string
    chat:string
    club_message:string
    document:string
    event:string
    group_message:string
    group:string
    message:string
    news:string
    organizer_archivedDocument:string
    organizer_clubDocument:string
    organizer_currentStatus:string
    organizer_myDocument:string
    personal_message:string
    subtask:string
    task:string
    course:string
    instructor:string
    room:string
    survey:string
    faq:string
    category:string
    crm_news:string
    crm_survey:string
}
