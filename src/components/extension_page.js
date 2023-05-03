/**
 * initaly hidden
 * @returns a dive representing the extension page
 */
const ExtensionPage = () => {
    return (
        <div id="extension_page">

        <div id="add_extension">
          <p id="extensions_text">Extensions</p>
          <form action="/action_page.php" id="search_extension_form">
            <label htmlFor="search_extension"></label>
            <textarea id="search_extension" name="search_extension" placeholder="Search Extensions"></textarea>
          </form>
          <div id="extensions">

          </div>
        </div>
        <div id="common_settings">
          <p id="common_settings_text">Commonly Used Settings</p>
          <div id="settings">

          </div>
        </div>
      </div>
    )
}

export { ExtensionPage }