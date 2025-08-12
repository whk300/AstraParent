#!/bin/bash

echo "🎨 Setting up SASS for AstraParenting..."

mkdir -p _sass/base _sass/components _sass/layout assets/css

cat > _sass/base/_variables.scss << 'SASS'
$primary-green: #2D5A27;
$sage-accent: #87A96B;
$pure-white: #FFFFFF;
$light-gray: #F5F5F5;
$border-gray: #E0E0E0;
$text-black: #000000;
SASS

cat > _sass/base/_reset.scss << 'SASS'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: $pure-white;
  color: $text-black;
}
SASS

# Typography
cat > _sass/base/_typography.scss << 'SASS'
h1, h2, h3 {
  font-family: 'Elephant', Georgia, serif;
  color: $primary-green;
}
SASS

cat > _sass/layout/_header.scss << 'SASS'
.header-wrapper {
  background: $pure-white;
  border-bottom: 1px solid $border-gray;
  padding: 1.5rem 2rem;
}

.title-block-v2 h1 {
  font-size: 2.25rem;
  color: $primary-green;
}
SASS

cat > _sass/layout/_navigation.scss << 'SASS'
.sticky-nav {
  background: $light-gray;
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}
SASS

cat > _sass/layout/_footer.scss << 'SASS'
.footer-bar {
  background: $light-gray;
  border-top: 1px solid $border-gray;
  padding: 2rem;
}
SASS

cat > _sass/components/_cards.scss << 'SASS'
.faq-section li {
  background: $light-gray;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
}
SASS

cat > _sass/components/_buttons.scss << 'SASS'
.btn-primary {
  background: $primary-green;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
}
SASS

echo "✅ SASS setup complete!"
