import { render } from 'preact'
import { rememberCreatorCodeFromUrl } from '@lucky-intelligence/account-ui'
import { App } from './app'
import './index.css'

// Creator links (https://mobile.gamership.com.mx/?ref=CODE): keep the code
// through login so the dashboard's purchase dialog can prefill it.
rememberCreatorCodeFromUrl()

render(<App />, document.getElementById('app')!)
