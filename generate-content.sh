#!/bin/bash

create_content() {
  local category=$1
  local subcategory=$2
  local slug=$3
  local title=$4
  
  mkdir -p _${category}/${subcategory}
  
  # Copy template and replace placeholders
  cat > _${category}/${subcategory}/${slug}.md << EOF
---
title: "${title}"
slug: ${slug}
category: ${category}
subcategory: ${subcategory}
date: $(date +%Y-%m-%d)
---

# ${title}

## Key Success Factors:
[Add quick answer here]

## Common Concerns/Causes
- [Concern 1]
- [Concern 2]
- [Concern 3]

## ✅ At-Home Treatments/Common Practices (by Ranking - Satisfaction & Popularity)

### Solution 1
[Description]

### Solution 2
[Description]

## 🏥 Professional Help - What to Expect/Preps
- [1]
- [2]
- [3]
- [4]

## Why It Works:
✅ [Explanation]

## Sources:
- [Source 1]
- [Source 2]
- [Source 3]

## Key Success Factors - Reminder
- [Factor 1]
- [Factor 2]
- [Factor 3]

  echo "✅ Created: _${category}/${subcategory}/${slug}.md"
}

create_content "pregnancy" "nutrition" "prenatal-vitamins" "Do I really need to take prenatal vitamins?"
create_content "pregnancy" "nutrition" "pregnancy-hunger" "Why am I so hungry all the time? Is it normal?"
create_content "pregnancy" "commonsymptoms" "morning-sickness" "Is morning sickness normal? When does it end?"
create_content "pregnancy" "commonsymptoms" "back-pain" "Is back pain normal during pregnancy? How can I relieve it?"
create_content "pregnancy" "commonsymptoms" "feet-hands-swelling" "Why are my feet and hands swelling? Is it dangerous?"
create_content "pregnancy" "commonsymptoms" "constipation" "I’m constipated — is this normal? What can I do?"
create_content "pregnancy" "lifestyle" "exercise" "Is it safe to exercise during pregnancy?"
create_content "pregnancy" "lifestyle" "stop-exercising" "When should I stop exercising during pregnancy?"
create_content "pregnancy" "prenatal-dr-care" "dr-visits" "How often do I need to see my doctor during pregnancy?"
create_content "pregnancy" "prenatal-dr-care" "tests" "What tests will I have during pregnancy?"
create_content "pregnancy" "prenatal-dr-care" "gestational-diabetes" "What is gestational diabetes? Can I prevent it?"
create_content "pregnancy" "prenatal-dr-care" "ultrasound" "Do I need an ultrasound at every visit?"
create_content "pregnancy" "prenatal-dr-care" "prenatal-visits" "What should I ask my doctor at prenatal visits?"
create_content "pregnancy" "labordelivery" "labor" "How do I know when I’m in real labor?"
create_content "pregnancy" "labordelivery" "birthplan" "What is a birth plan, and do I need one?"
create_content "pregnancy" "labordelivery" "painrelief-options" "What are my pain relief options during labor?"
create_content "pregnancy" "labordelivery" "c-section" "Can I have a natural birth after a C-section (VBAC)?"
create_content "pregnancy" "labordelivery" "discharge-from-care" "When should I go to the hospital or birth center?"
create_content "infant" "sleep" "training-colic-exhaustion" "How can I help my baby sleep independently without resorting to the 'cry it out' method"
create_content "infant" "sleep" "exahaustion"  "How do I cope with exhaustion and lack of sleep as a new parent?"
create_content "infant" "sleep" "colic" "How can I calm a colicky or constantly crying baby?"
create_content "infant" "feeding" "breastfedding" "Why is breastfeeding painful or difficult (cracked nipples, low milk supply)?"
create_content "infant" "feeding" "formula-solids"  "How do I choose formula and introduce solids safely?"
create_content "infant" "feeding" "swallowing" "My baby swallows air or burps frequently—is it due to feeding technique?"
create_content "infant" "health" "fever" "My baby has a fever — what should I do?"
create_content "infant" "health" "poop" "Is green poop normal in my baby?"
create_content "infant" "health" "acne" "How do I treat baby acne or cradle cap?"
create_content "infant" "health" "spit" s it normal for my baby to spit up a lot?"
create_content "infant" "development" "rolling"  "Is it normal if my baby isn’t rolling over by 6 months?"
create_content "infant" "development" "sitting" "My baby isn’t sitting unsupported or babbling—should I worry?"
create_content "infant" "development" "underdevelopment" "I’m worried my baby may be delayed across multiple areas—what should I do?"
create_content "infant" "development" "milestones" "Are milestone differences between babies normal, or is this problem?"
create_content "infant" "bonding" "c-section-nicu" "How can I bond with my baby after a NICU stay or if I had a C‑section?"
create_content "infant" "bonding" "recovering-c-section" "I’m recovering from C‑section—how do I connect when I’m not mobile?" 
create_content "infant" "bonding" "recongnition" "My baby doesn’t seem to recognize me—am I failing to bond?"
create_content "infant" "bonding" "premature-baby" "How can I bond with a premature baby under medical equipment?"
create_content "toddler" "tantrums" "tantrums" "Why is my toddler tantruming so often—and how can I de-escalate it calmly?"
create_content "toddler" "tantrums" "public-tantrums" "How do I handle public tantrums without embarrassment or escalation?"
create_content "toddler" "tantrums" "irritated-tantrums" "My child often tantrums when tired, hungry, or overstimulated—how do I prevent triggers?"
create_content "toddler" "tantrums" "extreme-tantrums" "What if my toddler’s tantrums seem extreme or frequent—do I need evaluation?"
create_content "toddler" "tantrums" "emotinal-regulation" "How do I help my toddler learn emotional regulation skills for long term?"
create_content "toddler" "potty-training" "start" "When is the right time to start potty training?"
create_content "toddler" "potty-training" "resist" "My child resists sitting on the potty—how can I ease into it?"
create_content "toddler" "potty-training" "accidents" "My toddler has frequent accidents or refuses consistently—what next?"
create_content "toddler" "potty-training" "defiance" "How can I manage toddler defiance or refusal during training?"
create_content "toddler" "potty-training" "regression" "We’ve made progress, but regression happened—how do I handle setbacks?"
create_content "toddler" "picky-eating" "vegetables" "Why won’t my toddler eat vegetables or try new foods?"
create_content "toddler" "picky-eating" "carbs-snacks" "My toddler eats only carbs/snacks—how do I expand diet variety?"
create_content "toddler" "picky-eating" "meals-refusal" "My toddler refuses meal or throws meals entirely—how do I keep nutrition balanced?"
create_content "toddler" "picky-eating" "1-food-group" "My toddler only eats from one food group for days—should I supplement or worry?"
create_content "toddler" "picky-eating" "treats" "Should I involve rewards, like charts or treats? How do I avoid bribery?"
create_content "toddler" "safety" "choking" "How can I prevent choking during meals and playtime?"
create_content "toddler" "safety" "falls-poisoning" "How do I child‑proof the house to prevent falls and poisoning?"
create_content "toddler" "safety" "climber" "My toddler is a climber”—how do I prevent falls and furniture tip-over?"
create_content "toddler" "safety" "toxic-ingestion" "What if my child ingests something toxic—how do I prepare?"
create_content "toddler" "safety" "teach" "How can I teach my toddler about safety without scaring them?"
create_content "toddler" "language-delays" "words-babbling" "My child isn’t babbling or saying words by 15 months—should I be concerned?"
create_content "toddler" "language-delays" "oneword-phase" "My child uses only one-word phrases at age 2—is that normal or concerning?"
create_content "toddler" "language-delays" "articulation" "My child has poor articulation—words are unclear or omitted—what can I do?"
create_content "toddler" "language-delays" "language-comprehension" "Should I worry if my child understands plenty but isn’t speaking much?"
create_content "toddler" "language-delays" "two-words" "What if my child still hasn’t joined two words together by age 2?"
create_content "preschooler" "kindergarten-prep" "emotionall-socially" "How can I help my child adjust emotionally and socially to kindergarten?"
create_content "preschooler" "kindergarten-prep" "academic-skills" "What academic skills (e.g., letters, numbers) are expected before kindergarten?"
create_content "preschooler" "kindergarten-prep" "struggles-focus" "My child struggles with sitting still or listening—how do I help?"
create_content "preschooler" "kindergarten-prep" "independence" "How can I build my child’s independence for school routines (e.g. dressing, packing)?"
create_content "preschooler" "kindergarten-prep" "separation-anxiety" "My child seems fine academically but won’t separate easily—how do I handle separation anxiety?"
create_content "preschooler" "aggressive-behaviors" "bad-behaviors" "Why is my child hitting or biting other kids?"
create_content "preschooler" "aggressive-behaviors" "no-to-all" "My child is defiant and says “no” to everything—how do I redirect behavior?"
create_content "preschooler" "aggressive-behaviors" "rules" "My child refuses to follow rules—even simple ones like hand-washing—what do I do?"
create_content "preschooler" "aggressive-behaviors" "evalution" "When should I worry and seek evaluation if aggressive behavior persists?"
create_content "preschooler" "aggressive-behaviors" "empathy" "How do I teach empathy and alternative behavior long-term?"
create_content "preschooler" "emotional-expression" "emotions" "My child seems to have big feelings but doesn’t say “I’m sad” or “I’m angry”—how can I help?"
create_content "preschooler" "emotional-expression" "calm-down" "How do I help my child calm down and use words when they’re overwhelmed?"
create_content "preschooler" "emotional-expression" "limited-emotions" "My child rarely shows happiness or sadness—they seem flat. Should I worry?"
create_content "preschooler" "emotional-expression" "emotional-expression" "Can emotional expression help with tantrums or expressing big emotions?"
create_content "preschooler" "emotional-expression" "complex-emotions" "How do I help my child describe more complex emotions like frustration, embarrassment, or jealousy?"
create-content "preschooler" "routine-structure" "bedtime" "How do I create a consistent bedtime routine that my child will follow willingly?"
create-content "preschooler" "routine-structure" "morning-mealtime" "How do I manage morning and mealtime routines without chaos or resistance?"
create-content "preschooler" "routine-structure" "transition" "My child fights transitions like moving from play to mealtime—how do I ease resistance?"
create-content "preschooler" "routine-structure" "disruptions" "How can I help my child calmly return to routines after disruptions (travel, illness)?"
create-content "preschooler" "routine-structure" "structured-routines" " Can structured routines help with behavior issues like bedtime resistance or defiance?"
create-content "preschooler" "screen-exposure" "screen-time" "How much screen time is safe for toddlers under 5?"
create-content "preschooler" "screen-exposure" "educational-apps" "Are educational apps helpful or just a distraction?"
create-content "preschooler" "screen-exposure" "all-the-time" "My kid insists on screens all the time—how do I redirect to play?"
create-content "preschooler" "screen-exposure" "sleep-speech" "Could screen use be affecting my child’s sleep or speech?"
create-content "preschooler" "screen-exposure" "privacy-ads" "How do I protect my child’s privacy and avoid ads inside apps?"
create-content "schooler" "academic-homework" "homework" "Why does my child resist homework even when they’re capable?"
create-content "schooler" "academic-homework" "ADHD" "How can I support my child with ADHD who struggles with focus and motivation?"
create-content "schooler" "academic-homework" "perfectionism" "How do I help my child cope with academic pressure or perfectionism?"
create-content "schooler" "academic-homework" "homework-routine" "How do I build a smooth homework routine that avoids daily drama?"
create-content "schooler" "academic-homework" "evaluation" "When should I consider evaluation for learning or attention challenges?"
create-content "schooler" "social-dynamics" "left-out" "How do I help when my child is being excluded or “left out” by friends?"
create-content "schooler" "social-dynamics" "bully-teased" "What should I do if my child is being teased or bullied at school?"
create-content "schooler" "social-dynamics" "standing-up-guide" "How can I guide my child to stand up kindly, not aggressively, toward bullies?"
create-content "schooler" "social-dynamics" "cyberbullying" "How do we handle early cyberbullying or mean behavior online (even simple messages)?"
create-content "schooler" "social-dynamics" "bullying-others" "My child may be bullying others—how can I help them change?"
create-content "schooler" "screen-time" "excessive" "My child plays games or watches YouTube for hours—how can I manage that screen addiction?"
create-content "schooler" "screen-time" "refusal-to-stop" "My child refuses to stop playing games or watching tablet videos—how should I handle the meltdown?"
create-content "schooler" "screen-time" "sleep-behavior" "Is my child’s sleep or behavior suffering because of all the device time?"
create-content "schooler" "screen-time" "trap-games-youtube" "YouTube and games feel like a trap—how do I ensure safe content and avoid addictive platforms?"
create-content "schooler" "screen-time" "balance" "How do I help my child find balance—so screens aren’t the default source of entertainment?"
create-content "schooler" "focus-issues" "distraction" "Why is my child easily distracted, losing focus or not finishing tasks?"
create-content "schooler" "focus-issues" "learning-disablilty" "Could this be ADHD or a learning disability affecting school performance?"
create-content "schooler" "focus-issues" "concentrate" "How can I help my child concentrate better during homework and schoolwork?"
create-content "schooler" "focus-issues" "physical-activity" "Can physical activity help? Is exercise part of treatment?"
create-content "schooler" "focus-issues" "emotion-comotions" "How do I manage emotional ups and downs, frustration, or overwhelm linked to focus problems?"
create-content "schooler" "self-esteem" "handling-failures" "How do I help my child handle failures without losing confidence?"
create-content "schooler" "self-esteem" "bouncing-back" "How can I build my child’s self-esteem so they bounce back from mistakes?"
create-content "schooler" "self-esteem" "resilience" "How do I teach resilience so my child can recover and grow from setbacks?"
create-content "schooler" "self-esteem" "perfectionism" "My child gets very upset when things don’t go perfectly—how can I ease perfectionism?"
create-content "schooler" "self-esteem" "daily-routines" "How can I foster daily routines and environments that reinforce confidence and resilience?"
create-content "early-teens" "puberty" "acne" "Is acne normal during puberty and what can I do about it?"
create-content "early-teens" "puberty" "physical-change" "My child is suddenly very tall and gangly—how do I help them cope?"
create-content "early-teens" "puberty" "image-self-esteem" "How do I support my child’s body image and self-esteem during puberty?"
create-content "early-teens" "puberty" "locker-room" "My child feels embarrassed or ashamed in locker rooms or around peers—how do I help?"
create-content "early-teens" "puberty" "professional-support" "When should I consider professional support for body image or emotional distress during puberty?"
create-content "early-teens" "sns-safety" "cyberbullied" "What should I do if my child is receiving mean messages or is cyberbullied?"
create-content "early-teens" "sns-safety" "sexting-explicit" "How do I talk about sexting or explicit content safely with my teen?"
create-content "early-teens" "sns-safety" "screen-addiction" "How can I help regulate screen addiction or obsessive social media use?"
create-content "early-teens" "sns-safety" "data-privacy-risk" "How do I protect my child’s privacy and avoid data risks online?"
create-content "early-teens" "sns-safety" "influencer-impact" "How do I manage influencer impact and mental health issues from comparing online?"
create-content "early-teens" "friendship-drama" "exclusion" "Why is my child being excluded from their friend group?"
create-content "early-teens" "friendship-drama" "wrong-crowd" "My child is following the wrong crowd—how can I stop it?"
create-content "early-teens" "friendship-drama" "toxic-friendship" "How can I tell if my child is in a toxic friendship?"
create-content "early-teens" "friendship-drama" "clique" "What should I do if my child is part of a clique or excluding others?"
create-content "early-teens" "friendship-drama" "How can I help my child resist peer pressure to do something risky?"
create-content "early-teens" "academic-stress" "homework-load" "How can I help my child manage the heavier homework load and multiple subjects?"
create-content "early-teens" "academic-stress" "grades-perfectnist" "What if my child is anxious about grades or overwhelmed by perfectionist expectations?"
create-content "early-teens" "academic-stress" "planning" "How do I support my child if they struggle with planning and turning in assignments on time?"
create-content "early-teens" "academic-stress" "mid-school-transition" "My child is overwhelmed by switching classrooms and subjects—how can I ease the adjustment?"
create-content "early-teens" "academic-stress" "evaluation-adhd" "When should I consider professional evaluation for ADHD or executive function issues affecting academic performance?"
create-content "early-teens" "power-struggles" "backtalk-arguing" "Why is my child frequently talking back or refusing?"
create-content "early-teens" "power-struggles" "not-following-rules" "My child refuses to follow rules—how do I enforce limits without constant struggle?"
create-content "early-teens" "power-struggles" "cooperation" "How do I prevent power struggles when my child just won’t cooperate?"
create-content "early-teens" "power-struggles" "emotional-overload" "What if my child’s defiance is triggered by emotional overload or frustration?"
create-content "early-teens" "power-struggles" "defiance" "At what point should I consider that defiance is more than ordinary testing—maybe disruptive behavior?"
create-content "late-teens" "mental-health" "depression-anxiety" "How do I know if my teen is at risk for depression, anxiety, or worse?"
create-content "late-teens" "mental-health" "suicidal-thoughts" "What if I suspect my teen is experiencing suicidal thoughts?"
create-content "late-teens" "mental-health" "eating-disorder" "How do I support my teen with signs of an eating disorder or body distress?"
create-content "late-teens" "mental-health" "media-related-stress" "How can I help my teen manage overwhelming anxiety or media-related stress?"
create-content "late-teens" "mental-health" "hiding-emotions" "My teen hides emotions—how do I encourage safe sharing and trust?"
create-content "late-teens" "college-future-plan" "college-prep" "How can I support my teen through college applications without overwhelming them?"
create-content "late-teens" "college-future-plan" "SAT-ACT" "How do I help if my teen is stressed about SAT/ACT exams?"
create-content "late-teens" "college-future-plan" "financial-pressure" "What about financial pressure and college affordability concerns?"
create-content "late-teens" "college-future-plan" "burnout" "How do I help my teen cope with burnout from juggling applications, classes, and activities?"
create-content "late-teens" "college-future-plan" "over-parenting" "When should I step back so my teen builds independence—and avoid over-parenting?"
create-content "late-teens" "substance-use" "drinking-vaping-marijuana" "What should I do if I suspect my teen is drinking, vaping, or using marijuana?"
create-content "late-teens" "substance-use" "idenitifying-substance-use" "How can I identify if substance use is becoming problematic?"
create-content "late-teens" "substance-use" "peer-norms" "My teen says “everyone vapes or drinks”—how do I help them navigate peer norms?"
create-content "late-teens" "substance-use" "experiments" "What should I do if my teen experiments once or twice—should I ignore or intervene?"
create-content "late-teens" "substance-use" "beyond-experimentation" "When is substance use beyond “normal experimentation” and requires urgent help?"
create-content "late-teens" "online-reputation" "social-media-uni-admission" "Could my teen’s social media hurt their college admission chances?"
create-content "late-teens" "online-reputation" "risky-content" "Should I encourage my teen to delete risky or embarrassing content—even if posted long ago?"
create-content "late-teens" "online-reputation" "sns-posting" "How can I teach my teen to think before posting—especially when emotional or under peer pressure?"
create-content "late-teens" "online-reputation" "sharenting" "What about “sharenting”? Can parents harm their teen’s image by posting about them?"
create-content "late-teens" "online-reputation" "college-digital-footprints" "How do colleges actually vet social media and digital footprints?"
create-content "late-teens" "romantic-relationships" "teaching-consent" "How do I teach my teen about consent and boundaries in relationships?"
create-content "late-teens" "romantic-relationships" "unhealthy-relationships" "How can I help my teen spot unhealthy or abusive relationships?"
create-content "late-teens" "romantic-relationships" "romantic-relationships-conversation" "When should I start talks about romantic relationships and consent?"
create-content "late-teens" "romantic-relationships" "non-consensual-behavior" "How do I respond if my teen discloses non-consensual behavior or pressure?"
create-content "late-teens" "romantic-relationships" "intimate-images" "Is it okay for teens to engage in sexting or share intimate images?"
