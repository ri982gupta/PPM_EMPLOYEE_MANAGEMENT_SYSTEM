import React, { useState } from "react";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
// import BiChevronRight from "@mui/icons-material/ArrowRight";
import { BiChevronRight } from "react-icons/bi";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpIcon from "@mui/icons-material/Help";
import { FaHome } from "react-icons/fa";

const ScreenBreadcrumbs = ({ routes, currentScreenName }) => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuClicked, setSubmenuClicked] = useState(false);
  // const [currentScreenName, setCurrentScreenName] = useState("");

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleParentClick = (event, route) => {
    event.preventDefault();

    if (!submenuClicked && route.subMenus && route.subMenus.length > 0) {
      handleMenuOpen(event);
    }

    setSubmenuClicked(false);

    // Set the current screen name
    // setCurrentScreenName(route.display_name);
  };

  const handleSubMenuClick = (event, urlPath) => {
    event.stopPropagation();
    console.log("Submenu clicked:", urlPath);
    const modifiedUrlPath = urlPath.replace(/::/g, "/");
    let path = "/#" + modifiedUrlPath;
    window.open(path, "_blank");
    handleMenuClose();
    setSubmenuClicked(true);
  };

  const renderSubMenuItems = (subMenus) => {
    return subMenus.map((subMenu) => (
      <MenuItem
        className="MuiMenuItem-root"
        style={{ fontSize: "12px", display: "block",
        padding: "6px 16px" }}
        key={subMenu.id}
        onClick={(event) => handleSubMenuClick(event, subMenu.url_path)}
      >
        {/* <Link
                    to={subMenu.url_path.replace(/::/g, "/")}
                    style={{ textDecoration: "none", color: "black" }}
                > */}
        {subMenu.display_name}
        {/* </Link> */}
      </MenuItem>
    ));
  };

  const renderBreadcrumbItem = (route, index) => {
    const isLast = index === routes.length - 1;
    const isActive = location.pathname === route.url_path;
    const hasSubMenus = route.subMenus && route.subMenus.length > 0;
    const itemClass = hasSubMenus ? "has-submenus" : "";
    let homepath = "/#" + location.pathname;

    return (
      <CBreadcrumbItem
        active={isLast || isActive}
        key={index}
        style={{ "--cui-breadcrumb-divider": <BiChevronRight /> }}
      >
        {index === 0 && (
          <a
            className="breadcrumbHomeIcon"
            onClick={() => {
              homepath == "/#/resource/dashboard"
                ? window.location.reload()
                : (window.location.href = "/#/resource/dashboard");
            }}
          >
            {/* {console.log(location.pathname, "location.pathname")} */}

            <FaHome />
          </a>
        )}
        {/* {!isLast && ( */}
        <BiChevronRight />
        {/* )} */}
        <a
          className={itemClass}
          onClick={(event) => handleParentClick(event, route)}
          style={{
            verticalAlign: "middle",
            color: isActive ? "#187fde" : "inherit",
            cursor: hasSubMenus ? "pointer" : "default",
          }}
        >
          {route.display_name != "home" && <>{route.display_name}</>}
        </a>
        {currentScreenName.length > 0 && (
          <>
            <BiChevronRight />
            {currentScreenName.map((name, idx) => (
              <span key={idx}>
                {name}
                {idx !== currentScreenName.length - 1 && <BiChevronRight />}
              </span>
            ))}
          </>
        )}
        {hasSubMenus && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            classes={{
              paper: "breadcrumbs-menu-paper",
            }}
          >
            {renderSubMenuItems(route.subMenus)}
          </Menu>
        )}
      </CBreadcrumbItem>
    );
  };

  return (
    <CBreadcrumb className="m-0 breadCrumbUI">
      {routes.map((route, index) => renderBreadcrumbItem(route, index))}
    </CBreadcrumb>
  );
};

ScreenBreadcrumbs.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url_path: PropTypes.string,
        display_name: PropTypes.string,
        icon_name: PropTypes.string,
        subMenus: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            display_name: PropTypes.string,
            url_path: PropTypes.string,
          })
        ),
      }),
    ])
  ).isRequired,
  currentScreenName: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ScreenBreadcrumbs;
