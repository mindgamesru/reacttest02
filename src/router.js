import app from 'ampersand-app'
import Router from 'ampersand-router'
import React from 'react'
import xhr from 'xhr'
import qs from 'qs'
import PublicPage from './pages/public'
import ReposPage from './pages/repos'

import Layout from './layout'

export default Router.extend({
    renderPage(page, opts = {layout: true}) {
        if(opts.layout) {
            page = (
                <Layout>
                    {page}
                </Layout>
            )
        }

        React.render(page, document.body)
    },

    routes: {
        '': 'public',
        'repos': 'repos',
        'login': 'login',
        'auth/callback?:query': 'authCallback'
    },

    public(){
        this.renderPage(<PublicPage />, {layout: false})
    },
    
    repos(){
        this.renderPage(<ReposPage />)
    },

    login(){
        window.location = 'https://github.com/login/oauth/authorize?' + qs.stringify({
                client_id: '309dd4df3ddfc3b5fd09',
                redirect_uri: window.location.origin + '/auth/callback',
                scope: 'user,repo'
            })
    },
    authCallback(query) {
        query = qs.parse(query);

        console.log(query);

        xhr({
            url: 'https://reacttest02.herokuapp.com/authenticate/' + query.code,
            json: true
        }, (err, rew, body) => {
            console.log(body);
            app.user.token = body.token
        })
    }
})