import React from "react";

export default () => (
  <section className="mailinglist">
    <div className="container">
      <div className="row">
        <div className="col-xs-12">
          <div className="hero-block">
            <h3>
              Questions, comments or feedback?
              <br />
              Email{" "}
              <a href="mailto:info@graphile.org?subject=Documentation%20question/comment/feedback:)">
                info@graphile.org
              </a>
            </h3>

            <form
              action="//graphile.us16.list-manage.com/subscribe/post?u=d103f710cf00a9273b55e8e9b&amp;id=c3a9eb5c4e"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className="validate"
              target="_blank"
              noValidate
            >
              <div id="mc_embed_signup_scroll" className="center hero-block">
                <p>
                  Keep up to date on Graphile and PostGraphile
                  features/changes. Subscribe to our occasional
                  announcements newsletter:
                </p>
                <div className="mc-field-group form-inline justify-content-center">
                  <div className="form-group">
                    <div className="mb2">
                      <label className="label--small" htmlFor="mce-EMAIL">
                        Email address:
                      </label>
                    </div>
                    <input
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      className="input-text mb0-ns mb1"
                      id="mce-EMAIL"
                      name="EMAIL"
                      spellCheck="false"
                      type="email"
                      value=""
                    />
                    {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
                    <div
                      style={{position: 'absolute', left: '-5000px'}}
                      aria-hidden="true"
                    >
                      <input
                        type="text"
                        name="b_d103f710cf00a9273b55e8e9b_c3a9eb5c4e"
                        tabIndex="-1"
                        value=""
                      />
                    </div>
                    <input
                      className="button--solid"
                      id="mc-embedded-subscribe"
                      name="subscribe"
                      type="submit"
                      value="Subscribe"
                    />
                  </div>
                  <div id="mce-responses" className="clear">
                    <div
                      className="response"
                      id="mce-error-response"
                      style={{display:'none'}}
                    />
                    <div
                      className="response"
                      id="mce-success-response"
                      style={{display:'none'}}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
)
