import React, { useState } from "react";
import styled from "styled-components";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import _ from "lodash";
import Link from "../Link";

const NestedListItem = styled(ListItem)`
  && {
    padding-left: ${(props) => props.theme.spacing(4) + "px"};
    padding-right: ${(props) => props.theme.spacing(2) + "px"};
  }
`;

const DoubleNestedListItem = styled(ListItem)`
  && {
    padding-left: ${(props) => props.theme.spacing(8) + "px"};
    padding-right: ${(props) => props.theme.spacing(2) + "px"};
  }
`;

const Toolbar = styled.div`
  ${(props) => props.theme.mixins.toolbar}
`;

const NavDrawer = styled.nav`
  ${(props) => props.theme.breakpoints.up("sm")} {
    width: ${(props) => props.theme.drawerWidth + "px"};
    flex-shrink: 0;
  }
`;

const DrawerBase = styled(Drawer)`
  .MuiDrawer-paper {
    width: ${(props) => props.theme.drawerWidth + "px"};
  }
`;

function ContentList(props) {
  const { title, list, nestedContent, hasNumbers, startOpened } = props;

  const [opened, setOpened] = useState({ [title]: !_.isNil(startOpened) });

  if (!title || !list) return <></>;

  const createClickHandler = (slug) => {
    return () => {
      setOpened((prevOpened) => {
        return { ...prevOpened, [slug]: !prevOpened[slug] };
      });
    };
  };

  return (
    <>
      <ListItem button onClick={createClickHandler(title)}>
        <ListItemText primary={title} />
        {opened[title] ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={opened[title]} timeout="auto" unmountOnExit>
        {list.map((content, idx) => (
          <React.Fragment key={content.slug}>
            {!_.isNil(nestedContent) ? (
              <>
                <NestedListItem
                  button
                  onClick={createClickHandler(content.slug)}
                  disableGutters
                >
                  <ListItemText
                    primary={`${
                      !_.isNil(hasNumbers)
                        ? _.padStart(idx + 1, 2, "0") + ". "
                        : ""
                    }${content.title}`}
                  />
                  {opened[content.slug] ? <ExpandLess /> : <ExpandMore />}
                </NestedListItem>
                <Collapse
                  in={opened[content.slug]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <DoubleNestedListItem
                      button
                      component={Link}
                      href={`/conteudo/${content.slug}`}
                      disableGutters
                    >
                      <ListItemText primary="Handout" />
                    </DoubleNestedListItem>
                    <DoubleNestedListItem
                      button
                      component={Link}
                      href={`/conteudo/${content.slug}/exercicios`}
                      disableGutters
                    >
                      <ListItemText primary="Exercícios" />
                    </DoubleNestedListItem>
                  </List>
                </Collapse>
              </>
            ) : (
              <NestedListItem
                button
                component={Link}
                href={`/conteudo/${content.slug}`}
                disableGutters
              >
                <ListItemText
                  primary={`${
                    !_.isNil(hasNumbers)
                      ? _.padStart(idx + 1, 2, "0") + ". "
                      : ""
                  }${content.title}`}
                />
              </NestedListItem>
            )}
          </React.Fragment>
        ))}
      </Collapse>
    </>
  );
}

function AppDrawer({ ariaLabel, mobileOpen, onClose, contentLists }) {
  if (!contentLists) return null;

  const topics = contentLists.topics;
  const otherLists = _.omit(contentLists, ["topics"]);

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ContentList
          title="Aulas"
          list={topics}
          hasNumbers
          nestedContent
          startOpened
        />
        <Divider />
        {_.entries(otherLists).map(([listName, list]) => (
          <React.Fragment key={listName}>
            <ContentList title={listName} list={list} />
            <Divider />
          </React.Fragment>
        ))}
        {/* <ListItem button component={Link} to={ROUTES.thanks.link()}>
          Agradecimentos
        </ListItem> */}
        <Divider />
      </List>
    </div>
  );

  return (
    <NavDrawer aria-label={ariaLabel}>
      <Hidden smUp implementation="css">
        <DrawerBase
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </DrawerBase>
      </Hidden>
      <Hidden xsDown implementation="css">
        <DrawerBase variant="permanent" open>
          {drawer}
        </DrawerBase>
      </Hidden>
    </NavDrawer>
  );
}

export default AppDrawer;
