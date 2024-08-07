import { useState, useEffect } from "react" ;
import styles from "./NavMenu.module.css" ;

import { NavLink } from "react-router-dom" ;

// React Icons for Menu Items
import { CgProfile } from "react-icons/cg" ;
import { GrCircleInformation } from "react-icons/gr";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { LiaGlobeAmericasSolid } from "react-icons/lia";
import { TbHome, TbHomeHand } from "react-icons/tb";
import { MdOutlineCastForEducation } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { FaMountainSun } from "react-icons/fa6";

const menuArray = [
    {value: 0, name: "Home", 
        icon:<TbHomeHand style={{color: "rgba(255, 255, 255, 1.0)", fontSize: "2.1rem", marginRight: "0.3rem", marginTop: "-0.8rem", marginBottom: '-0.2rem'}}/>, url: "/"},
    {value: 1, name: "App", 
        icon:<FaMountainSun style={{color: "rgba(255, 255, 255, 1.0)", fontSize: "2.1rem", marginRight: "0.3rem", marginTop: "-2.5rem", marginBottom: '-0.2rem'}}/>, url: "/app"},
    {value: 2, name: "Mission", 
        icon:<MdOutlineConnectWithoutContact style={{color: "rgba(255, 255, 255, 1.0)", fontSize: "1.9rem", marginRight: "0.3rem", marginTop: "-0.8rem", marginBottom: '-0.2rem'}}/>, url: "/mission"},
    {value: 3, name: "About", 
        icon:<GrCircleInformation style={{color: "rgba(255, 255, 255, 1.0)", fontSize: "2.1rem", marginRight: "0.3rem", marginTop: "-0.8rem", marginBottom: '-0.2rem'}}/>, url: "/about"},
    {value: 4, name: "Tutorials", 
        icon: <MdOutlineCastForEducation style={{color: "rgba(255, 255, 255, 1.0)", fontSize: "2.1rem", marginRight: "0.3rem", marginTop: "-0.8rem", marginBottom: '-0.2rem'}}/>, url: "/tutorials"}, 
]

// Header Component for HomePage:
export function NavMenu({ showDev }) {
    const [showNav, setShowNav] = useState(false) ;
    const [showDevSub, setShowDevSub] = useState(showDev) ;
    return(
        <>
        <header className={styles.navbar}>
            <NavLink to={menuArray[0].url}>
                <img src="/imperial-valley-logo.png" alt="Imperial Valley Rural Heat Data and Alarm System" className={styles.logo} />
            </NavLink>
            <nav>
                <div className={showNav ? [styles.menu, styles.active].join(" ") : styles.menu }>
                    <ul className={showNav ? [styles.menu, styles.active].join(" ") : styles.menu}>
                        {menuArray.map((item) => {
                            return(
                                <li>
                                    <NavLink to={item.url} style={{textDecoration: "none", color: "rgba(255, 255, 255, 1.0)"}}>
                                        {item.icon}
                                        {item.name}
                                    </NavLink>
                                </li>
                            ) ;
                        })}
                    </ul>
                </div>
            </nav>
            <div onClick={() => setShowNav(!showNav)}
                 className={styles.mobile_button}>
                    {showNav === true 
                        ?
                        <IoCloseOutline size={45} style={{color: "rgba(255, 255, 255, 1.0)"}} /> 
                        :
                        <IoMdMenu size={50} style={{color: "rgba(255, 255, 255, 1.0)"}} />
                    }
            </div>
        </header>

        <header className={styles.subNav} style={{display: showDevSub === true ? "inline-flex" : "none"}}>
            <div>
                Developed by {" "}
                    <a href={"https://www.premier-analytics.com/"} style={{textDecoration: "underline", color: "rgba(255, 255, 255, 1)", fontWeight: "600"}}> 
                        Ryan Paul Lafler
                    </a> 
                    {" "} ✅ Sign-up for the latest Imperial Valley updates!
            </div>
        </header>
        </>
    ) ;
} ;
