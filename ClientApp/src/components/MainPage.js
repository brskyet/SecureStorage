import React, { Component, } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

const url = "api/Account";

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Donut', 452, 25.0, 51, 4.9),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Honeycomb', 408, 3.2, 87, 6.5),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Jelly Bean', 375, 0.0, 94, 0.0),
    createData('KitKat', 518, 26.0, 65, 7.0),
    createData('Lollipop', 392, 0.2, 98, 0.0),
    createData('Marshmallow', 318, 0, 81, 2.0),
    createData('Nougat', 360, 19.0, 9, 37.0),
    createData('Oreo', 437, 18.0, 63, 4.0),
];

export class MainPage extends Component {
    displayName = MainPage.name

    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };

        this.getAccounts();
    }

    User = [
        { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
        { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
        { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
        { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
        { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
    ];

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
                console.log(this.state.categories)
            })
            .catch(error => {
                //console.log(error)
                this.logout()
            });
    }

    render() {
        return (
            <div>
                MainPage
                <button className="btn btn-mode" onClick={this.logout}>
                    Log out
                </button>

                <TreeView>
                    {this.state.categories.map(c => (
                        <TreeItem key={this.state.categories.indexOf(c)} nodeId={this.state.categories.indexOf(c).toString()} label={c.categoryName}>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell align="right">Username</TableCell>
                                            <TableCell align="right">Password</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {c.accounts.map(a => (
                                            <TableRow key={c.accounts.indexOf(a)}>
                                                <TableCell >{a.title}</TableCell>
                                                <TableCell align="right">{a.username}</TableCell>
                                                <TableCell align="right">{a.password}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TreeItem>
                    ))}
                </TreeView>
            </div>
        );
    }
}
