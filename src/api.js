/* Info */

export const baseUrl = "https://bp-apigateway-service.herokuapp.com/";

export const apiUrlNurseries = baseUrl + 'api/provider/nurseries'

export const apiUrlNursery = baseUrl + 'api/provider/nurseries/'

export const apiUrlCourses = baseUrl + 'api/provider/courses'

export const apiUrlActivities = baseUrl + 'api/provider/activities'

export const apiUrlCourse = baseUrl + 'api/provider/course'

export const apiUrlLocation = baseUrl + 'api/provider/locations/custom-location'

export const apiUrlCoursesName = baseUrl + 'api/provider/courses/custom-course'

export const apiUrlActivitiesName = baseUrl + 'api/provider/activities/custom-activity'

export const apiUrlReviews = baseUrl + 'api/client/reviews'

export const apiUrlFcmToken = baseUrl + 'api/notifications/fcm/store-token'

/* Auth */

export const apiUrlSignupClient = baseUrl + 'api/client/register'
export const apiUrlSignupProvider = baseUrl + 'api/provider/register'

export const apiUrlLoginClient = baseUrl + 'api/client/login'
export const apiUrlLoginProvider = baseUrl + 'api/provider/login'

export const apiUrlForgetClient = 'client/forgot-password/email'
export const apiUrlForgetProvider = 'provider/forgot-password/email'

export const apiUrlGoogleClient = baseUrl + 'api/auth/google/callback/client'
export const apiUrlGoogleProvider = baseUrl + 'api/auth/google/callback/provider'

export const apiUrlFacebookClient = baseUrl + 'api/auth/facebook/redirect/client'
export const apiUrlFacebookProvider = baseUrl + 'api/auth/facebook/redirect/provider'

export const apiUrlVerfResend = baseUrl + 'api/email/verification-notification'

export const apiUrlCheckUserAuth = baseUrl + 'api/check/auth'

export const apiUrlCheckUserFirstTime = baseUrl + 'api/check/first-login'

export const apiUrlSetUserFirstTime = baseUrl + 'api/check/first-login'

export const apiUrlPhoneVerification = baseUrl + 'api/phone/verify'

export const apiUrlPhoneVerificationResend = baseUrl + 'api/phone/verification-notification'

export const apiUrlEmailVerificationResend = baseUrl + 'api/email/verification-notification'

export const apiUrlloginType = baseUrl + 'api/check/login-type'

export const apiUrlClientRegister2 = baseUrl + 'api/client/clients'

export const apiUrlLogout = baseUrl + 'api/logout'

/* client */

export const apiUrlAddChild = baseUrl + 'api/client/children'

export const apiUrlUpdateChild = baseUrl + 'api/client/children/'

export const apiUrlViewChildren = baseUrl + 'api/client/children'

export const apiUrlViewChild = baseUrl + 'api/client/children/'

export const apiUrlGetProfile = baseUrl + 'api/client/profile'

export const apiUrlUpdateProfile = baseUrl + 'api/client/clients/'

export const apiUrlClientReqReservation = baseUrl + 'api/client/reservations'

export const apiUrlClientShowReservations = baseUrl + 'api/client/reservations'

export const apiUrlClientShowReservation = baseUrl + 'api/client/reservations/'

export const apiUrlClientCancelReservation = baseUrl + 'api/client/reservations'

export const apiUrlClientShowSubscriptions = baseUrl + 'api/client/subscriptions'

export const apiUrlChildReservation = baseUrl + 'api/client/reservations/child/'

export const apiUrlClientNotifications = baseUrl + 'api/notifications'

export const apiUrlClientDashboard = baseUrl + 'api/provider/dashboard/client/index/'

export const apiUrlChildShowReservations = baseUrl + 'api/client/reservations/child/'

export const apiUrlChildShowSubscriptions = baseUrl + 'api/client/subscriptions/child/'

export const apiUrlClientPayment = baseUrl + 'api/client/payment/'

// export const apiUrlClientPayment = baseUrl + 'api/client/payment/{orderId}/pay/redirect/{payment_method}'

/* provider */

export const apiUrlProviderDashboard = baseUrl + 'api/provider/dashboard/provider/index/'

export const apiUrlShowProvider = baseUrl + 'api/provider/providers/profile'

export const apiUrlUpdateProvider = baseUrl + 'api/provider/providers/'

export const apiUrlViewProvider = baseUrl + 'api/provider/providers'

export const apiUrlViewMoreProvider = baseUrl + 'api/provider/providers/profile'

export const apiUrlCreateNursery = baseUrl + 'api/provider/nurseries'

export const apiUrlUpdateNursery = baseUrl + 'api/provider/nurseries'

export const apiUrlProviderNotifications = baseUrl + 'api/notifications'

export const apiUrlProviderReservations = baseUrl + 'api/provider/reservations/'

export const apiUrlProviderShowReservation = baseUrl + 'api/provider/reservations/'

export const apiUrlProviderArchiveReservations = baseUrl + 'api/provider/reservations/archive/'

export const apiUrlProviderCancelReservation = baseUrl + 'api/provider/reservations/'

export const apiUrlProviderSubscriptions = baseUrl + 'api/provider/subscriptions/'

export const apiUrlProviderArchiveSubscriptions = baseUrl + 'api/provider/subscriptions/archive/'

export const apiUrlProviderChildren = baseUrl + 'api/provider/children'

export const apiUrlProviderArchiveChildren = baseUrl + 'api/provider/children/archive/'

export const apiUrlProviderAddTimetable = baseUrl + 'api/provider/timetables'

export const apiUrlProviderTimetables = baseUrl + 'api/provider/timetables/'

export const apiUrlProviderArchiveTimetables = baseUrl + 'api/provider/timetables/archive/'

/* Store in archive */

export const apiUrlStoreInTimetablesArchive = baseUrl + 'api/provider/timetables/'

/* Restore from archive*/

export const apiUrlRestoreFromTimetablesArchive = baseUrl + 'api/provider/timetables/archive/restore/'

export const apiUrlRestoreFromSubscriptionsArchive = baseUrl + 'api/provider/subscriptions/archive/restore/'

export const apiUrlRestoreFromReservationsArchive = baseUrl + 'api/provider/reservations/archive/restore/'
