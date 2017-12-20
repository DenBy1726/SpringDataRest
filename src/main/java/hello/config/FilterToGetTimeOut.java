package hello.config;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.MessageFormat;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.filter.OncePerRequestFilter;

public class FilterToGetTimeOut extends OncePerRequestFilter {

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException {
        try {
            if(request.getSession(false) == null) { //Session don't exists

                if (request.getRequestedSessionId() != null && !request.isRequestedSessionIdValid()) {
                    response.sendRedirect("/login?timeout=true");
                }
                else{
                    filterChain.doFilter(request, response);
                }
            }
            else{
                filterChain.doFilter(request, response);
            }
        } catch (Exception e) {
            //Log Exception

        }
    }
}