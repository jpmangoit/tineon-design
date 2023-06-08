
    //   export interface Button{
    //     no: "string"
    //     yes: "string"
    // }

    export interface Languages {
        Survey : Survey;
        button : Object;
        club_document: ClubDocument;
        club_events    : ClubEvent;
        club_news: ClubNews;
        club_wall: ClubWall;
        community : Community;
        community_groups: CommunityGroups;
        community_messages: CommunityMessages;
        confirmation_message  : ConfirmationMessage;
        courses  : Courses;
        create_chat  : CreateChat;
        create_event  : CreateEvent;
        create_faq    : CreateFaq;
        create_group  : Object;
        create_message    : Object;
        create_news : Object;
        create_task  : Object;
        dashboard  : Object;
        email       : Object;
        error_message   : Object;
        genral_message   : Object;
        group_news  : Object;
        header_club  : Object;
        instructor  : Object;
        language    : Language;
        login       : Login;
        menu      : Object;
        move_document   : Object;
        new_create_event  : Object;
        organizer       : Object;
        organizer_task  : Object;
        pagination       : Object;
        profile         : Object;
        profile_bank     : Object;
        recoverPassword    : RecoverPassword;
        response_message   : Object;
        room            : Object;
        social_link     : Object;
        theme: Object;
    }

    export interface Login{
        loginDesc: string,
        loginHeading: string,
        password: string,
        passwordError: string,
        recoverPassword: string,
        rememberMe: string,
        signIn: string,
        signInHeading: string,
        userName: string,
        userNameError:string,
    }

    export interface Survey{
        approved_status: any;
        active_form: string
        active_survey: string
        active_until: string
        add: string
        additional_settings:string
        after_voting: string
        all_club: string
        always: string
        anonymous_voting: string
        answer_option: string
        author: string
        back: string
        by: string
        cancel: string
        cast_vote: string
        choice_notifications: string
        close: string
        close_survey: string
        completed_votes: string
        create_survey: string
        creation_date: string
        day_ago: string
        day_left: string
        days_ago: string
        days_left: string
        edit: string
        email_notification: string
        expired:string
        expired_date: string
        month_ago: string
        months_ago: string
        multiple_option: string
        multiple_selection: string
        my_votes: string
        never:string
        no_completed_votes: string
        no_survey: string
        no_votes: string
        number_of_vote: string
        people_voting: string
        remaining_time: string
        remove: string
        save: string
        save_update: string
        show_all: string
        single_option:string
        single_selection: string
        survey: string
        survey_close: string
        survey_vote: string
        thanks_vote: string
        title: string
        to_vote: string
        toggle: string
        total_vote: string
        update_surey: string
        view_detail: string
        view_results: string
        view_survey: string
        vote_related: string
        votes: string
        voting_options:string
        voting_result: string
        voting_setting: string
        web_notification: string
        user_id:any
        image:string
    }

    export interface Button{
        no: "string"
        yes: "string"
    }

    export interface ClubDocument{
        all: string,
        archived_documents: string
        club_documents: string
        current_status: string
        my_documents: string
        no_documents:string
        title: string
    }

    export interface ClubEvent {
        no_events:  string
        show_calendar:  string
        title:  string
        today:  string
        upcoming:  string
    }
    export interface ClubNews {
        Back: string
        Delete: string
        Edit: string
    }
    export interface ClubWall{
        club_dates: string
        club_events: string
        club_news: string
        create_event: string
        create_news: string
        title: string
    }
    export interface Community{
        groups: string
        messages: string
        new_chat: string
        new_group: string
        new_message: string
        title: string
    }
    export interface CommunityGroups{
        Back: string
        Delete: string
        Edit_group: string
        all_groups: string
        all_participants: string
        approved: string
        cancelled: string
        delete_group_popup: string
        group_news: string
        groups: string
        groups_u_joined: string
        groups_u_manage: string
        join_group: string
        join_group_popup: string
        leave_group: string
        leave_group_popup: string
        members: string
        no_news: string
        participants: string
        pending: string
        posts: string
        posts_for_u: string
        read_more: string
    }
    export interface CommunityMessages{
        all_active_chat: string
        allmail: string
        clubAllMessages: string
        clubDraftMessages: string
        clubMessages: string
        clubSentMessages: string
        clubStarredMessages: string
        clubTrashMessages: string
        club_messages: string
        code_error: string
        delete: string
        drafts: string
        groupAllMessages: string
        groupDraftMessages: string
        groupMessages: string
        groupSentMessages: string
        groupStarredMessages: string
        groupTrashMessages: string
        group_messages: string
        inbox: string
        message_sent: string
        move_inbox: string
        move_starreds: string
        move_trash: string
        permanently_delete: string
        personalAllMessages: string
        personalDraftMessages: string
        personalMessages: string
        personalSentMessages: string
        personalStarredMessages: string
        personalTrashMessages: string
        personal_messages: string
        reply: string
        replyToAll: string
        search: string
        sent: string
        starred: string
        trash: string
    }
    export interface ConfirmationMessage{
        accept_event_invitation:  string
        accept_group:  string
        accept_msg:  string
        accept_task_invitation:  string
        approved_event:  string
        approved_task:  string
        complete_task:  string
        delete_Email:  string
        delete_Room:  string
        delete_article:  string
        delete_category:  string
        delete_course:  string
        delete_draft_msg:  string
        delete_event:  string
        delete_faq:  string
        delete_instructor:  string
        delete_msg:  string
        delete_survey:  string
        delete_task:  string
        deny_article:  string
        deny_event_invitation:  string
        deny_group:  string
        deny_msg:  string
        deny_task_invitation:  string
        join_course:  string
        permanently_delete_msg:  string
        publish_article:  string
        save_msg_draft:  string
        send_msg_trash:  string
        unapproved_event:  string
        unapproved_task:  string
    }
    export interface Courses{
        all_instructor:  string
        allowed_person:  string
        already_joined:  string
        availability:  string
        cancel:  string
        course_details:  string
        course_duration:  string
        courses:  string
        create_course:  string
        day:  string
        days:  string
        end_date:  string
        every:  string
        external:  string
        instructor:  string
        instructor_type:  string
        internal:  string
        join_course:  string
        location:  string
        location_placeholder:  string
        month:  string
        no_course_found:  string
        number_of_person:  string
        ok:  string
        organizer:  string
        participants:  string
        price:  string
        price_placeholder:  string
        reset:  string
        room_availibility:  string
        room_error:  string
        rooms:  string
        start_date:  string
        third_panel:  string
        time:  string
        title_label:  string
        title_placeholder:  string
        type:  string
        update_course:  string
        week:  string
        year:  string
    }
    export interface CreateChat{
        group_chat:  string
        new_club_chat:  string
        new_group_chat:  string
        personal_chat:  string
        select_placeholder:  string
        title:  string
        type:  string
    }
    export interface CreateEvent{
        add_a_picture_optional: string
        cancel: string
        chargeable: string
        club: string
        club_event: string
        courses: string
        description: string
        description_placeholder: string
        download_attachment: string
        end_date: string
        end_time: string
        event_price: string
        event_price_placeholder: string
        functionaries_event: string
        group: string
        group_event: string
        location: string
        location_placeholder: string
        optional: string
        participants: string
        participants_placeholder: string
        private: string
        public: string
        room_number: string
        room_number_placeholder: string
        save_and_update: string
        seminar: string
        show_guests: string
        showall: string
        start_date: string
        start_time: string
        title: string
        title_label: string
        title_placeholder: string
        type: string
        type_placeholder: string
        view_attachment: string
        visibility: string
        visibility_placeholder: string

    }

    export interface CreateFaq{

    }

    export interface Language{
        deutsch:  string
        english:  string
        turkish:  string
    }

    export interface RecoverPassword {
        backTo:  string
        haveAccount:  string
        loginDesc:  string
        loginHeading:  string
        passwordHeading:  string
        signIn:  string
        submit:  string
        successMsg:  string
        userName:  string
        userNameError:  string
    }






