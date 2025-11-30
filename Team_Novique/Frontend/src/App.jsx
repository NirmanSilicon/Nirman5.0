import Analytics from './Screens/Analytics'
import { Routes ,Route } from 'react-router'
import DashBoard from "./Screens/DashBoard";
import Paticular_Syllabus_page from './Screens/Paticular_Syllabus_page';
import Home from './Screens/Home';
import Upload from './Screens/Upload';
import Notes from './Screens/Notes';
import Navbar from './components/Navbar';
import Quiz from './Screens/Quiz';
import { Flashcards } from './Screens/FlashCards';
import { Rewards } from './Screens/Rewards';
import ChatBubble from './Screens/ChatBubble';
import StudyNotesShowcase from './Screens/StudyNotesShowcase';
function App() {
  return (
    <>
      <div>
        <ChatBubble/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<DashBoard/>}/>
        <Route path='/analytics' element={<Analytics/>}/>
        <Route path='/paticular_Syllabus/:sub/:id' element={<Paticular_Syllabus_page/>}/>
        <Route path= '/upload' element={<Upload/>}/>
        <Route path= '/notes/:subId/:topicname/:topicId' element={<Notes/>}/>
        <Route path='/quiz/:subId/:topicname/:topicId' element={<Quiz/>}/>
        <Route path='/flash' element={<Flashcards/>}/>
        <Route path= '/reward' element={<Rewards/>}/>
        <Route path= '/study' element={<StudyNotesShowcase/>}/>
      </Routes>
      </div>
    </>
  );
}

export default App;
