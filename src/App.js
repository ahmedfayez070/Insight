import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom"
import { useSelector } from 'react-redux'
import './App.css'

import Home from "./components/Home/Home"
import AllNurseries from './components/AllNurseries/AllNurseries.js'
import BrowseCourses from "./components/BrowseCourses/BrowseCourses"
import BrowseActivities from "./components/BrowesActivities/BrowesActivities"
import LogIn1 from "./components/LogIn1/LogIn1"
import LogIn2 from "./components/LogIn2/LogIn2"
import SignUp1 from './components/SignUp1/SignUp1'
import SignUp2 from "./components/SignUp2/SignUp2"
import Courses from "./components/Courses/Courses"
import NurseryInfo from "./components/NurseryInfo/NurseryInfo"
import CourseInfo from "./components/CourseInfo/CourseInfo"
import ProviderLogin1 from './components/provider/login1/login1'
import ProviderLogin2 from './components/provider/login2/login2'
import ProviderSignup1 from './components/provider/signup1/signup1'
import ProviderSignup2 from './components/provider/signup2/signup2'
import AddNursery from './components/provider/add-nursery/add-nursery'
import Nurseryprofile from './components/provider/nursery-profile/nursery-profile'
import ProviderProfile from "./components/provider/ProviderDashboard/ProviderProfile/ProviderProfile"
import ProviderDashboard from "./components/provider/ProviderDashboard/ProviderDashboard/ProviderDashboard"
import ProviderReservations from "./components/provider/ProviderDashboard/Reservations/Reservations"
import ProviderSubscriptions from "./components/provider/ProviderDashboard/Subscriptions/Subscriptions"
import ProviderChildren from "./components/provider/ProviderDashboard/Children/Children"
import ProviderReservationsArchive from "./components/provider/ProviderDashboard/ReservationArchive/ReservationArchive"
import ProviderSubscriptionsArchive from "./components/provider/ProviderDashboard/SubscriptionArchive/SubscriptionArchive"
import ProviderChildrenArchive from "./components/provider/ProviderDashboard/ChildrenArchive/ChildrenArchive"
import ProviderTimetable from "./components/provider/ProviderDashboard/Timetable/Timetable"
import ProviderTimetableArchive from "./components/provider/ProviderDashboard/TimetableArchive/TimetableArchive"
import ProviderNewTimetable from "./components/provider/ProviderDashboard/NewTimetable/NewTimetable"
import AddNewNursery from "./components/provider/ProviderDashboard/AddNewNursery/AddNewNursery"
import ProviderChildInfo from "./components/provider/ChildInfo/ChildInfo"
import PhoneVerification from "./components/PhoneVerifivation/PhoneVerification"
import NurseryResAccept from "./components/NurseryResAccept/NurseryResAccept"
import ReservationReq from "./components/ReservationReq/ReservationReq"
import AddChild from "./components/client/AddChild/AddChild"
import ClientProfile from "./components/client/client-profile/client-profile"
import ClientRegister2 from "./components/client/ClientRegister2/ClientRegister2"
import ClientReservations from "./components/client/ClientReservations/ClientReservations"
import ClientDashboard from "./components/client/ClientDashboard/ClientDashboard"
import ClientSubscriptions from "./components/client/ClientSubscriptions/ClientSubscriptions"

import Protected from "./protected"

import PageNotFound from "./components/NotFound/NotFound"

const App = () => {

  const token = useSelector(state => state.loginReducer.token)

  const loginPage = useLocation().pathname.search('client') > -1 ? '/login1' : '/provider-login1'

  const isAuthed = token ? true: false

  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="nurseries" element={<AllNurseries />} />
        <Route path="browse-courses" element={<BrowseCourses />} />
        <Route path="browse-activities" element={<BrowseActivities />} />
        <Route path="courses" element={<Courses />} />
        <Route path="login1" element={<LogIn1 />} />
        <Route path="login2" element={<LogIn2 />} />
        <Route path="signup1" element={<SignUp1 />} />
        <Route path="signup2" element={<SignUp2 />} />
        <Route path="nursery-info" element={<NurseryInfo />} />
        <Route path="course-info" element={<CourseInfo />} />
        <Route path="provider-login1" element={<ProviderLogin1 />} />
        <Route path="provider-login2" element={<ProviderLogin2 />} />
        <Route path="provider-signup1" element={<ProviderSignup1 />} />
        <Route path="provider-signup2" element={<ProviderSignup2 />} />
        <Route path="phone-verification" element={<PhoneVerification />} />

        <Route path="provider-add-nursery" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><AddNursery /></Protected>} />
        <Route path="provider-nursery-profile" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><Nurseryprofile /></Protected>} />
        <Route path="provider-reservation-req" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ReservationReq /></Protected>} />
        <Route path="provider-profile" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderProfile /></Protected>} />
        <Route path="provider-dashboard" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderDashboard /></Protected>} />
        <Route path="provider-reservations" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderReservations /></Protected>} />
        <Route path="provider-subscriptions" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderSubscriptions /></Protected>} />
        <Route path="provider-children" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderChildren /></Protected>} />
        <Route path="provider-reservations-archive" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderReservationsArchive /></Protected>} />
        <Route path="provider-subscriptions-archive" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderSubscriptionsArchive /></Protected>} />
        <Route path="provider-children-archive" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderChildrenArchive /></Protected>} />
        <Route path="provider-timetable" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderTimetable /></Protected>} />
        <Route path="provider-timetable-archive" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderTimetableArchive /></Protected>} />
        <Route path="provider-add-timetable" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderNewTimetable /></Protected>} />
        <Route path="provider-add-new-nursery" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><AddNewNursery /></Protected>} />
        <Route path="provider-child-info" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ProviderChildInfo /></Protected>} />

        <Route path="client-add-child" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><AddChild /></Protected>} />
        <Route path="client-profile" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ClientProfile /></Protected>} />
        <Route path="client-register2" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ClientRegister2 /></Protected>} />
        <Route path="client-reservations" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ClientReservations /></Protected>} />
        <Route path="client-dashboard" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ClientDashboard /></Protected>} />
        <Route path="client-subscriptions" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><ClientSubscriptions /></Protected>} />
        <Route path="client-nursery-res-acc" element={<Protected loginPage={loginPage} isAuthed={isAuthed}><NurseryResAccept /></Protected>} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    // </BrowserRouter>
  )
}

export default App;