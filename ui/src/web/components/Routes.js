import React from 'react';
import { Route, Switch } from 'react-router-dom';


const Routes = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={Home} />
            </Switch>
        </div>
    );
};

class Home extends React.Component{
    render(){
        return (
        <div>
            "Home"
        </div>
        )
    }
}

export default Routes;
