FROM mongo:bionic

COPY company.json /company.json
COPY user_preference.json /user_preference.json
COPY user.json /user.json
COPY import.sh /import.sh

RUN chmod +x /import.sh
ENTRYPOINT ["/import.sh"]
