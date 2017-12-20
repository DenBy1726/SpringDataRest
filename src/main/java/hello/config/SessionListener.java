package hello.config;

import hello.model.Credential;
import org.springframework.stereotype.Component;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;

//@Component
public class SessionListener implements HttpSessionAttributeListener {

    @Override
    public void attributeAdded(HttpSessionBindingEvent event) {
        if (event.getValue() instanceof Credential) {
            // An instance of YourObject has been bound to the session.
        }
    }

    @Override
    public void attributeRemoved(HttpSessionBindingEvent event) {
        if (event.getValue() instanceof Credential) {
            // An instance of YourObject has been unbound from the session.
        }
    }

    @Override
    public void attributeReplaced(HttpSessionBindingEvent event) {
        if (event.getValue() instanceof Credential) {
            // An instance of YourObject has been replaced in the session.
        }
    }

}