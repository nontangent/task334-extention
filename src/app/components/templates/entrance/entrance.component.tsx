import * as React from 'react';
import { AppService } from '../../../app.service';
import Logo from '-!svg-react-loader?name=Logo!./logo.svg';

export interface Props {

}

export interface State {

}

export class EntranceTemplate extends React.Component<Props, State> {
    private appService: AppService;

    constructor(props: Props) {
        super(props);

        this.state = {

        };

        this.appService = AppService.instance;
    }

	onClickSignUpButton() {
		this.appService.signUp();
	}

    render() {
        return (
            <div className="entrance-template">
                <div className="logo-container">
                    <Logo />
                </div>
                <div className="button-container">
                    <button onClick={() => {this.onClickSignUpButton()}}>Twitterでタスク管理を始める</button>
                </div>
            </div>
        )
    }
}