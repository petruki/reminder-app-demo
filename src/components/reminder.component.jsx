import React from 'react';
import DatePicker from "react-datepicker";
import { reminderService } from '../_services';
import "react-datepicker/dist/react-datepicker.css";
import { BlockUIComponent } from './block-ui.component';

class ReminderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: props.creating,
            deleting: false,
            reminder: props.reminder,
            reminder_edit: JSON.parse(JSON.stringify(props.reminder))
        };

        this.state.reminder.date = new Date(props.reminder.date);
        this.state.reminder_edit.date = new Date(props.reminder.date);
    }

    onChangeDate(date) {
        const reminder = this.state.reminder;
        reminder.date = date;
        this.setState({
            reminder
        });
    }

    onChange(e, field) {
        const reminder = this.state.reminder;
        reminder[field] = e.target.value;
        this.setState({
            reminder
        });
    }

    onToggleEdit(status, canceled) {
        this.setState({
            editing: status
        });

        if (canceled) {
            this.setState({
                reminder: Object.create(this.state.reminder_edit)
            }, () => this.props.onEditChild(status, this.state.reminder._id));
        } else if (!status) {
            if (this.state.reminder._id) {
                reminderService
                    .updateById(this.state.reminder)
                    .then(() => this.props.onFilter(null, null, false))
                    .catch((e) => this.props.onFilter());
            } else {
                reminderService
                    .create(this.state.reminder)
                    .then(() => {
                        this.props.onFilter();
                        this.props.updateDashboard();
                    })
                    .catch((e) => this.props.onFilter());
            }
        } else {
            this.props.onEditChild(status, this.state.reminder._id);
        }
    }

    onCancelDelete() {
        if (this.state.reminder._id) {
            if (this.state.editing) {
                this.onToggleEdit(false, true);
            } else {
                this.setState({ deleting: true });
                this.props.onEditChild(true, this.state.reminder._id);
            }
        } else {
            this.props.onFilter(null, null, false);
        }
    }

    onConfirmDelete(response) {
        if (response) {
            reminderService
                .deleteById(this.state.reminder._id)
                .then(() => {
                    this.props.updateDashboard();
                    this.props.onFilter();
                });
        } else {
            this.setState({ deleting: false });
            this.props.onEditChild(false, this.state.reminder._id);
        }
    }

    render() {
        const { name, description, priority, date } = this.state.reminder;
        const { editing, deleting, startDate } = this.state;

        return (
            <div className={editing ? 
                'card margin-bottom-10 min-height-100 editing' + (!this.props.creating ? 'min-height-200px' : '') : 
                'card margin-bottom-10 min-height-100'}>

                <BlockUIComponent blocked={this.props.blockui} />
                <div className="card-header">
                    <p className="margin-auto float-leftt" hidden={editing}><i className="fa fa-star"></i> {name}</p>
                    <input hidden={!editing} type="text" 
                        className="form-control width-60 float-left" placeholder="Reminder Name" value={name}
                        onChange={(e) => this.onChange(e, 'name')}>
                    </input>
                    <div className={deleting ? 'hide' : 'float-right'}>
                        <button className={editing ? 
                            'btn btn-success margin-left-10' : 
                            'btn btn-primary margin-left-10'}
                            onClick={() => this.onToggleEdit(!editing)}>
                                <i className="fa fa-pencil-square-o"></i>
                                <span className="hide-small-screen">{editing ? 'Save' : 'Edit'}</span>
                        </button>
                        <button className={editing ? 
                            'btn btn-secondary margin-left-10' : 
                            'btn btn-danger margin-left-10'}
                            onClick={() => this.onCancelDelete()}>
                                <i className={editing ? 'fa fa-times' : 'fa fa-trash-o'}></i>
                                <span className="hide-small-screen">{editing ? 'Cancel' : 'Delete'}</span>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="margin-bottom-10">
                        <p hidden={editing}>{description}</p>
                        <textarea hidden={!editing} placeholder="Reminder Description"
                            className="form-control margin-bottom-10" rows="3" value={description}
                            onChange={(e) => this.onChange(e, 'description')}>
                        </textarea>
                    </div>
                    <div className={deleting ? 'confirmation-panel' : 'hide'}>
                        <p><i className="fa fa-exclamation"></i> Are you sure you want to delete this reminder?</p>
                        <button className="btn btn-secondary margin-left-10" onClick={() => this.onConfirmDelete(true)}>
                            <i className="fa fa-check"></i> Yes
                        </button>
                        <button className="btn btn-secondary margin-left-10" onClick={() => this.onConfirmDelete(false)}>
                            <i className="fa fa-times"></i> No
                        </button>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="display-flex">
                        <select className="custom-select width-70" disabled={!editing} value={priority}
                            onChange={(e) => this.onChange(e, 'priority')}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <DatePicker className="form-control margin-left-10"
                            disabled={!editing}
                            selected={date ? date : startDate} 
                            onChange={date => this.onChangeDate(date)} />
                    </div>
                </div>
            </div>
        );
    }
}

export { ReminderComponent };