#!/bin/bash

echo "🚀 Setting up Jekyll structure for AstraParenting..."

mkdir -p _data _includes _layouts _pregnancy _infant _toddler _preschooler _schooler _early_teens _late_teens _stories _sass/base _sass/components assets/css assets/js assets/images pages

touch _config.yml Gemfile staticman.yml 404.html index.html
touch _data/navigation.yml
touch _includes/header.html _includes/footer.html _includes/head.html
touch _includes/navigation.html _includes/search.html _includes/comments.html
touch _includes/story-widget.html
touch _layouts/default.html _layouts/home.html _layouts/topic.html
touch _layouts/story.html _layouts/page.html
touch _sass/main.scss assets/css/main.scss assets/js/main.js
touch pages/about.md pages/privacy.md pages/terms.md

echo "✨ Jekyll structure created successfully!"
