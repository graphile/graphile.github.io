import React from "react";

export default function MailchimpSignup() {
  return (
    <div>
      <form
        action="//graphile.us16.list-manage.com/subscribe/post?u=d103f710cf00a9273b55e8e9b&amp;id=c3a9eb5c4e"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
        target="_blank"
        noValidate="novalidate"
      >
        <div id="mc_embed_signup_scroll" className="center hero-block">
          <p>
            Keep up to date on Graphile Engine and PostGraphile
            features/changes. Subscribe to our occasional announcements
            newsletter:
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
                defaultValue=""
              />
              {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
              <div
                style={{ position: "absolute", left: "-5000px" }}
                aria-hidden="true"
              >
                <input
                  type="text"
                  name="b_d103f710cf00a9273b55e8e9b_c3a9eb5c4e"
                  tabIndex="-1"
                  defaultValue=""
                />
              </div>
              <input
                className="button--solid"
                id="mc-embedded-subscribe"
                name="subscribe"
                type="submit"
                defaultValue="Subscribe"
              />
            </div>
            <div id="mce-responses" className="clear">
              <div
                className="response"
                id="mce-error-response"
                style={{ display: "none" }}
              />
              <div
                className="response"
                id="mce-success-response"
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      </form>
      <script
        type="text/javascript"
        defer
        src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"
      />
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='BIRTHDAY';ftypes[3]='birthday';}(window.jQuery));var $mcj = jQuery.noConflict(true);`,
        }}
      />
    </div>
  );
}
