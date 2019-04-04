import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { Container } from 'reactstrap';
import axios from "axios";
import Fuse from 'fuse.js';

import host from "../../host.js";
import SearchBar from '../Search/SearchBar';
import SearchResults from '../Search/SearchResults';
import GroupMembersList from './GroupMembersList.js';
import GroupInviteesList from './GroupInviteesList.js';

class GroupMembersView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            group: '',
            members: [],
            invitees: [],
            users: [],
            search: '',
            isOwner: false,
            error: null
        };
    }

    componentDidMount() {
        axios
            .get(`${host}/api/groups/${this.state.id}`)
            .then(res => {
                this.setState({ group: res.data });
            })
            .catch(err => this.setState({ error: err }));

        axios
            .get(`${host}/api/groups/${this.state.id}/groupMembers`)
            .then(res => {
                this.setState({
                    members: res.data,
                    search: '',
                });
            })
            .catch(err => this.setState({ error: err }));

        axios
            .get(`${host}/api/groups/${this.state.id}/groupInvitees`)
            .then(res => {
                this.setState({ invitees: res.data });
            })
            .catch(err => this.setState({ error: err }));

        this.checkIfOwner(this.state.id);
    }

    checkIfOwner = async (id) => {
        const groupOwners = `${host}/api/groups/${id}/groupOwners`;
        const userId = parseInt(localStorage.getItem('userId'));
        try {
            const res = await axios.get(groupOwners)
            res.data[0].userId === userId
                ? this.setState({ isOwner: true })
                : this.setState({ isOwner: false })
        } catch (err) {
            this.setState({ error: err })
        }

    }

    handleSearch = async (e) => {
        this.setState({
            search: e.target.value
        });

        let users;
        await axios
            .get(`${host}/api/users`)
            .then(res => users = res.data)
            .catch(err => this.setState({ error: err }));

        if (users) {
            const options = {
                shouldSort: true,
                findAllMatches: true,
                threshold: 0.2,
                location: 0,
                distance: 128,
                maxPatternLength: 128,
                minMatchCharLength: 3,
                keys: [
                    "displayName",
                    "email"
                ]
            };
            const fuse = new Fuse(users, options);
            const results = fuse.search(this.state.search);

            const usersUpdated = results.map(user => {
                let buttonInvite = true
                this.state.invitees.forEach(invitee => {
                    if (invitee.userId === user.id) {
                        buttonInvite = false
                    }
                })
                this.state.members.forEach(member => {
                    if (member.userId === user.id) {
                        buttonInvite = false
                    }
                })
                return { ...user, buttonInvite }
            })

            this.setState({
                users: usersUpdated,
            });
        }
    }

    inviteUser = (e, id) => {
        e.preventDefault();
        const users = this.state.users
        const index = users.findIndex(user => user.id === id)

        const user = this.state.users[index]
        const userUpdated = { ...user, buttonInvite: false }
        users.splice(index, 1, userUpdated)

        const userId = localStorage.getItem('userId')
        const activity = { userId, activity: `Invited ${user.displayName} to the group` }
        axios
            .post(`${host}/api/groups/${this.state.id}/activities`, activity)
            .then(() => {
                axios
                    .post(`${host}/api/groups/${this.state.id}/groupInvitees`, { userId: id })
                    .then(res => {
                        this.setState({
                            users: users,
                            invitees: res.data
                        })
                    })
                    .catch(err => this.setState({ error: err }));
            })
            .catch(err => this.setState({ error: err }));
    }

    removeUser = (e, id, userDisplayName) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId')
        const activity = { userId, activity: `Removed ${userDisplayName} from the group` }
        axios
            .post(`${host}/api/groups/${this.state.id}/activities`, activity)
            .then(() => {
                axios
                    .delete(`${host}/api/groups/${this.state.id}/groupMembers/${id}`)
                    .then(res => {
                        this.setState({ members: res.data });
                    })
                    .catch(err => this.setState({ error: err }));
            })
            .catch(err => this.setState({ error: err }));
    }

    removeInvitee = (e, id, userDisplayName) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId')
        const activity = { userId, activity: `Cancelled ${userDisplayName}'s invitation.` }
        axios
            .post(`${host}/api/groups/${this.state.id}/activities`, activity)
            .then(() => {
                axios
                    .delete(`${host}/api/groups/${this.state.id}/groupInvitees/${id}`)
                    .then(res => {
                        this.setState({ invitees: res.data });
                    })
                    .catch(err => this.setState({ error: err }));
            })
            .catch(err => this.setState({ error: err }));
    }

    render() {

        let { error, group, search, users, members, invitees, isOwner } = this.state
        const userId = parseInt(localStorage.getItem('userId'));

        return (
            <>
                {error
                    ? <p>Error retrieving members!</p>
                    : <>
                        <section className="container blog">
                            <div className="row">
                                <div className="col-md-8">

                                    <div>
                                        <h2>{group.name}</h2>
                                    </div>

                                    <GroupMembersList
                                        isOwner={isOwner}
                                        members={members}
                                        userId={userId}
                                        removeUser={this.removeUser}
                                    />

                                    <GroupInviteesList
                                        isOwner={isOwner}
                                        invitees={invitees}
                                        removeInvitee={this.removeInvitee}
                                    />

                                </div>

                                <aside className="col-md-4 sidebar-padding">
                                {isOwner
                                    ? <>
                                        <SearchBar
                                            inputValue={search}
                                            updateSearch={this.handleSearch}
                                        />
                                        {this.state.search.length >= 3
                                            ? <SearchResults
                                                users={users}
                                                inviteUser={this.inviteUser}
                                            />
                                            : null
                                        }
                                    </>
                                    : null
                                }
                                </aside>

                            </div>
                        </section>

                    </>
                }
                {/* <Link to={`/group/${id}`}>
                    Back to Group
                </Link>

                {isOwner
                    ? <>
                        <SearchBar
                            inputValue={search}
                            updateSearch={this.handleSearch}
                        />
                        {this.state.search.length >= 3
                            ? <SearchResults
                                users={users}
                                inviteUser={this.inviteUser}
                            />
                            : null
                        }
                    </>
                    : null
                }

                <GroupMembersList
                    isOwner={isOwner}
                    members={members}
                    userId={userId}
                    removeUser={this.removeUser}
                />

                <GroupInviteesList
                    isOwner={isOwner}
                    invitees={invitees}
                    removeInvitee={this.removeInvitee}
                /> */}

            </>
        )
    }
}

export default GroupMembersView;