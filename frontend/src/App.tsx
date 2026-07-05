import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/app/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Layout from "./components/app/Layout"
import MyPosts from "./components/app/MyPosts"
import Friends from "./components/app/Friends"
import Saved from "./components/app/Saved"
import Dashboard from "./components/app/Dashboard"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="my-posts" element={<MyPosts />} />
          <Route path="friends" element={<Friends />} />
          <Route path="saved" element={<Saved />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App