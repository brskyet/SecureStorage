import React, { Component, } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter,
    IconButton, Fab, Tooltip, TextField, Snackbar, Button, ButtonGroup, Grid,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import { Add, Delete, ArrowDropDown, ArrowDropUp, Edit, Done, Close, Visibility, VisibilityOff, DeleteSweep } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';

import './MainPage.css';

const url = "api/Account";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export class MainPage extends Component {
    displayName = MainPage.name

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            temp_title: "",
            temp_username: "",
            temp_password: "",
            temp_password_visibility: false,
            validate_message_open: false,
            global_mode: false,
            add_dialog: false,
            delete_dialog: false,
            new_category_name: "",
            current_category: -1,
            success_message: false
        };

        this.getAccounts();

        this.edit = this.edit.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.cancel_edit = this.cancel_edit.bind(this);
        this.admit_edit = this.admit_edit.bind(this);
        this.cancel_delete = this.cancel_delete.bind(this);
        this.admit_delete = this.admit_delete.bind(this);
        this.onTempTitleChange = this.onTempTitleChange.bind(this);
        this.onTempPasswordChange = this.onTempPasswordChange.bind(this);
        this.onTempUsernameChange = this.onTempUsernameChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.switch_visibility = this.switch_visibility.bind(this);
        this.switch_temp_visibility = this.switch_temp_visibility.bind(this);
        this.cancel = this.cancel.bind(this);
        this.delete_category = this.delete_category.bind(this);
        this.onAddCategory = this.onAddCategory.bind(this);
        this.add_dialog_close = this.add_dialog_close.bind(this);
        this.add_category_confirm = this.add_category_confirm.bind(this);
        this.onNewCategoryChanged = this.onNewCategoryChanged.bind(this);
        this.confirm_delete_category = this.confirm_delete_category.bind(this);
        this.delete_dialog_close = this.delete_dialog_close.bind(this);
        this.save_changes = this.save_changes.bind(this);
        this.handleCloseSuccessMessage = this.handleCloseSuccessMessage.bind(this);
    }

    logout() {
        localStorage.setItem('status', false);
        window.location.reload();
    }

    getAccounts() {
        fetch(`${url}/GetAccounts`, {
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    throw response.statusText
                }
            })
            .then(result => {
                this.setState({
                    categories: result
                })
                for (var c of this.state.categories) {
                    c.has_new_item = false;
                    for (var a of c.accounts) {
                        a.edit_mode = false;
                        a.delete_mode = false;
                        a.password_visibility = false;
                    }
                }
                //console.log(this.state.categories)
            })
            .catch(error => {
                //console.log(error)
                this.logout()
            });
    }

    delete(c, a) {
        var newCategories = this.state.categories
        newCategories[c].accounts[a].delete_mode = true
        this.setState({
            categories: newCategories,
            temp_username: newCategories[c].accounts[a].username,
            temp_title: newCategories[c].accounts[a].title,
            temp_password: newCategories[c].accounts[a].password,
            global_mode: true
        })
    }

    cancel_delete(c, a) {
        var newCategories = this.state.categories
        newCategories[c].accounts[a].delete_mode = false
        this.setState({
            categories: newCategories,
            temp_username: "",
            temp_title: "",
            temp_password: "",
            global_mode: false
        })
    }

    admit_delete(c, a) {
        var newCategories = this.state.categories
        newCategories[c].accounts.splice(a, 1)
        this.setState({
            categories: newCategories,
            temp_username: "",
            temp_title: "",
            temp_password: "",
            global_mode: false
        })
    }

    add(c) {
        var newCategories = this.state.categories
        if (newCategories[c].has_new_item)
            return
        else
            newCategories[c].has_new_item = true
        newCategories[c].accounts.push({ username: "", password: "", title: "", edit_mode: true })
        this.setState({
            categories: newCategories,
            temp_username: "",
            temp_title: "",
            temp_password: "",
            global_mode: true
        })
    }

    edit(c, a) {
        var newCategories = this.state.categories
        newCategories[c].accounts[a].edit_mode = true
        this.setState({
            categories: newCategories,
            temp_username: newCategories[c].accounts[a].username,
            temp_title: newCategories[c].accounts[a].title,
            temp_password: newCategories[c].accounts[a].password,
            global_mode: true
        })
    }

    cancel_edit(c, a) {
        var newCategories = this.state.categories
        if (newCategories[c].has_new_item)
            newCategories[c].accounts.pop()
        else
            newCategories[c].accounts[a].edit_mode = false
        newCategories[c].has_new_item = false
        this.setState({
            categories: newCategories,
            global_mode: false
        })
    }

    admit_edit(c, a) {
        if (this.state.temp_username === "" || this.state.temp_password === "") {
            this.setState({ validate_message_open: true })
            return
        }
        var newCategories = this.state.categories
        newCategories[c].accounts[a].edit_mode = false
        newCategories[c].accounts[a].title = this.state.temp_title
        newCategories[c].accounts[a].username = this.state.temp_username
        newCategories[c].accounts[a].password = this.state.temp_password
        newCategories[c].has_new_item = false
        this.setState({
            categories: newCategories,
            global_mode: false
        })
    }

    onTempTitleChange(event) {
        this.setState({ temp_title: event.target.value });
    }

    onTempUsernameChange(event) {
        this.setState({ temp_username: event.target.value });
    }

    onTempPasswordChange(event) {
        this.setState({ temp_password: event.target.value });
    }

    handleClose() {
        this.setState({ validate_message_open: false })
    }

    switch_visibility(c, a) {
        var newCategories = this.state.categories
        newCategories[c].accounts[a].password_visibility = !newCategories[c].accounts[a].password_visibility
        this.setState({
            categories: newCategories
        })
    }

    switch_temp_visibility() {
        this.setState({
            temp_password_visibility: !this.state.temp_password_visibility
        })
    }

    cancel() {
        this.getAccounts()
    }

    save_changes() {
        fetch(`${url}/UpdateAccounts`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.categories)
        })
            .then(response => {
                if (response.ok) {
                    this.setState({ success_message: true });
                }
                else {
                    throw response.statusText
                }
            })
            .catch(error => {
                //console.log(error)
                this.logout()
            });
    }

    delete_category(c) {
        this.setState({ delete_dialog: true, current_category: c });
    }

    confirm_delete_category() {
        var newCategories = this.state.categories
        newCategories.splice(this.state.current_category, 1)
        this.setState({
            categories: newCategories,
            delete_dialog: false
        })
    }

    add_dialog_close() {
        this.setState({ add_dialog: false });
    }

    delete_dialog_close() {
        this.setState({ delete_dialog: false });
    }

    add_category_confirm() {
        var newCategories = this.state.categories
        newCategories.push({ accounts: [], categoryName: this.state.new_category_name, has_new_item: false })
        this.setState({
            categories: newCategories,
            add_dialog: false
        })
    }

    onAddCategory() {
        this.setState({ add_dialog: true, new_category_name: "" });
    }

    onNewCategoryChanged(event) {
        this.setState({ new_category_name: event.target.value });
    }

    handleCloseSuccessMessage() {
        this.setState({ success_message: false });
    }

    render() {
        return (
            <div>
                <Grid container justify="flex-end" alignItems="center">
                    <Button className="btn btn-log-out" onClick={this.logout}>
                        Log out
                    </Button>
                </Grid>

                <Dialog open={this.state.add_dialog} onClose={this.add_dialog_close} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add category</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please, enter name of category
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Category Name"
                            type="text"
                            fullWidth
                            value={this.state.new_category_name}
                            onChange={this.onNewCategoryChanged}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.add_category_confirm} color="primary">
                            Add
                        </Button>
                        <Button onClick={this.add_dialog_close} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.delete_dialog}
                    onClose={this.delete_dialog_close}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Are you sure to delete category?"}</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.confirm_delete_category} color="primary">
                            Delete
                        </Button>
                        <Button onClick={this.delete_dialog_close} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    open={this.state.validate_message_open}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                    message="Username and password are required!"
                    action={
                        <React.Fragment>
                            <Button color="secondary" size="small" onClick={this.handleClose}>
                                UNDO
                            </Button>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                                <Close fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />

                <Snackbar open={this.state.success_message} autoHideDuration={5000} onClose={this.handleCloseSuccessMessage}>
                    <Alert onClose={this.handleCloseSuccessMessage} severity="success">
                        {"Saved successfully!"}
                    </Alert>
                </Snackbar>

                <TreeView className="main-container"
                    defaultCollapseIcon={<ArrowDropUp className="arrow-icon" />}
                    defaultExpandIcon={<ArrowDropDown className="arrow-icon" />}
                    defaultParentIcon={<DeleteSweep />}
                >
                    {this.state.categories.map(c => (
                        <Table key={this.state.categories.indexOf(c)}>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <TreeItem key={this.state.categories.indexOf(c)} nodeId={this.state.categories.indexOf(c).toString()} label={c.categoryName}>
                                            <TableContainer component={Paper} className="nested-element">
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="center">Action</TableCell>
                                                            <TableCell align="center">Title</TableCell>
                                                            <TableCell align="center">Username</TableCell>
                                                            <TableCell align="center">Password</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {c.accounts.map(a => (
                                                            !a.edit_mode && !a.delete_mode ?
                                                                <TableRow key={c.accounts.indexOf(a)}>
                                                                    <TableCell align="center">
                                                                        <IconButton disabled={this.state.global_mode && (!a.delete_mode || !a.edit_mode)}
                                                                            aria-label="edit" size="medium"
                                                                            onClick={() => { this.edit(this.state.categories.indexOf(c), c.accounts.indexOf(a)) }}>
                                                                            <Edit />
                                                                        </IconButton>
                                                                        <IconButton disabled={this.state.global_mode && (!a.delete_mode || !a.edit_mode)}
                                                                            aria-label="delete" size="medium"
                                                                            onClick={() => { this.delete(this.state.categories.indexOf(c), c.accounts.indexOf(a)) }}>
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                    <TableCell align="center"><TextField value={a.title} readOnly /></TableCell>
                                                                    <TableCell align="center"><TextField value={a.username} readOnly /></TableCell>
                                                                    <TableCell align="center">
                                                                        <TextField type={a.password_visibility ? "text" : "password"} value={a.password} readOnly />
                                                                        <IconButton aria-label="Show/Hide" size="medium"
                                                                            onClick={() => { this.switch_visibility(this.state.categories.indexOf(c), c.accounts.indexOf(a)) }}>
                                                                            {a.password_visibility ? <Visibility /> : <VisibilityOff />}
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                                :
                                                                <TableRow key={c.accounts.indexOf(a)}>
                                                                    <TableCell align="center">
                                                                        <IconButton aria-label="done" size="medium" onClick={() => {
                                                                            !a.delete_mode ? this.admit_edit(this.state.categories.indexOf(c), c.accounts.indexOf(a))
                                                                                : this.admit_delete(this.state.categories.indexOf(c), c.accounts.indexOf(a))
                                                                        }}>
                                                                            <Done />
                                                                        </IconButton>
                                                                        <IconButton aria-label="cancel" size="medium" onClick={() => {
                                                                            !a.delete_mode ? this.cancel_edit(this.state.categories.indexOf(c), c.accounts.indexOf(a))
                                                                                : this.cancel_delete(this.state.categories.indexOf(c), c.accounts.indexOf(a))
                                                                        }}>
                                                                            <Close />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                    <TableCell align="center"><TextField disabled={a.delete_mode} value={this.state.temp_title}
                                                                        onChange={this.onTempTitleChange} /></TableCell>
                                                                    <TableCell align="center"><TextField disabled={a.delete_mode} required value={this.state.temp_username}
                                                                        onChange={this.onTempUsernameChange} /></TableCell>
                                                                    <TableCell align="center">
                                                                        <TextField autoComplete="new-password" disabled={a.delete_mode} required
                                                                            type={this.state.temp_password_visibility ? "text" : "password"} value={this.state.temp_password}
                                                                            onChange={this.onTempPasswordChange} />
                                                                        <IconButton aria-label="Show/Hide" size="medium" onClick={() => { this.switch_temp_visibility() }}>
                                                                            {a.password_visibility ? <Visibility /> : <VisibilityOff />}
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                        )
                                                        )}
                                                    </TableBody>
                                                    <TableFooter>
                                                        <TableRow>
                                                            <TableCell>
                                                                <Grid container justify="center" alignItems="center">
                                                                    <Tooltip disabled={this.state.global_mode} title="Add" aria-label="add"
                                                                        onClick={() => { this.add(this.state.categories.indexOf(c)) }} >
                                                                        <Fab color="primary">
                                                                            <Add />
                                                                        </Fab>
                                                                    </Tooltip>
                                                                </Grid>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableFooter>

                                                </Table>
                                            </TableContainer>
                                        </TreeItem>
                                    </TableCell>
                                    <TableCell className="cell-for-button">
                                        <IconButton aria-label="Delete" size="medium" onClick={() => { this.delete_category(this.state.categories.indexOf(c)) }}>
                                            <DeleteSweep />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    ))
                    }
                </TreeView>
                <Grid container justify="center" alignItems="center">
                    <Tooltip title="Add category" className="center" onClick={() => { this.onAddCategory() }}>
                        <Fab color="default">
                            <Add />
                        </Fab>
                    </Tooltip>
                </Grid>
                <Grid container justify="center" alignItems="center">
                    <ButtonGroup size="large" aria-label="large outlined primary button group" className="button-group">
                        <Button className="btn btn-save-cancel" onClick={this.save_changes}>Save</Button>
                        <Button className="btn btn-save-cancel" onClick={this.cancel}>Cancel</Button>
                    </ButtonGroup>
                </Grid>
            </div >
        );
    }
}
