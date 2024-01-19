#!/usr/bin/env bash

docker exec -it activepieces bash -c '
    script_id="$AP_SCRIPT_ID";
    script_url="$AP_SCRIPT_URL";
    onload_function="window.parent.postMessage('\''script_loaded'\'', '\''*'\'');"

    sed -i "/<script .*id=\"$script_id\".*<\/script>/d" /usr/share/nginx/html/index.html;
    sed -i "s#</title>#</title>\n<script src=\"$script_url\" id=\"$script_id\" onload=\"$onload_function\"></script>#" /usr/share/nginx/html/index.html
'
