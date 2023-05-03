/**
 * log in page of the reccoon work web. Initialy hidden.
 * @returns a div representing the log in page
 */
const LoginPage = () => {
    return (
        <div id="login_page">
        <div id="user_info_input">
          <form action="/action_page.php" id="search_">
            <label htmlFor="username"></label>
            <textarea id="username" name="username" placeholder="Username: " className="textbox"></textarea>
            <textarea id="password" name="password" placeholder="Password: " className="textbox"></textarea>
          </form>
          <button type="button" id="login" className="button placeholder_text">Login</button>
          <button type="button" id="create_user" className="button placeholder_text">Create New Account</button>
          <p id="login_error_hint" className="text"></p>
        </div>
      </div>
    )
}

export { LoginPage }