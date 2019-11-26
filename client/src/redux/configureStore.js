import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducer as formReducer } from 'redux-form'

import thunk from 'redux-thunk';

import { contact } from './contact'
import { console } from './console'
import { projects } from './projects'

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            contact,
            console,
            projects,
            form: formReducer
        }),
        applyMiddleware(thunk)
    )

    return store
}