const LeftBar = ({switch_page}) => {
    return (
        <>
            <div className="left_bar">
                <span id="bar_point1" className={"circle left_buttom"} onClick={() => {switch_page("#main_interface")} }></span>
                <span id="bar_point2" className={"circle left_buttom"} onClick={() => {switch_page("#extension_page")} }></span>
            </div>
        </>
    )
}

export default LeftBar;