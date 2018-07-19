'use strict';

const e = React.createElement;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: []
        }
    }
    
    componentDidMount() {
        fetch('api/messages')
            .then(response => response.json())
            .then(messages => this.setState({messages}));
    }

    render() {
        const { messages } = this.state;

        return e('div', {
            children: [
                e('h1', { key: 'header'}, 'Hello World'), 
                messages.length ? e('ul', {
                    key: 'messages',
                    children: messages.map(({message, id}) => e('li', { key: id}, message))
                }) : 'loading'
            ]
        });
    }
}

const appDiv = document.querySelector('#app');
ReactDOM.render(e(App), appDiv);

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js')
    .then(registration => console.log("Service worker registered", registration))
    .catch(failure => console.log("Service worker failure", failure));
} else {
    console.log("Service worker not supported");
}