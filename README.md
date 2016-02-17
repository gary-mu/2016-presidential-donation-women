# 2016-presidential-donation-women
Examine if women donate more to female and liberal candidates with Ohio 2016 Presidential contribution data from FEC
You can also visit the link to see the chart: <a href="https://s3-us-west-2.amazonaws.com/d3-udacity/index.html" target="_blank">https://s3-us-west-2.amazonaws.com/d3-udacity/index.html</a>

##Summary 
Do Women Donate More to Women and Liberal candidates?
Crowdpac research shows that when it comes to political contributions, women give more to liberals and to other women. This visualization takes Ohio state as a case, to examine if women indeed donate more to liberals and to women candidates. Looking at the condaidates that still remain as of February 20th of 2016, and compare their political contributions amount received in dollars, and the donors gender compositions vs overall gender distributions.


##Design 
I first used a bar chart showing the absolute political contribution for each candidates. Along with color coding for the party they belong to, it gives a birds eye view to compare the donations amount received by each candidates and by the party affiliation of the candidates. 

To zero in on a particular candidate and his/her donations received by donor gender comparing to average, I decide to let users decide who they are interested in knowing more, and by clicking on the candidate's name in the bar chart, two charts appears to the right, comparing their donation received by gender comparing to overall average. The donut chart houses a pie chart inside, which renders faster and clearer comparison. And when users hover on the chart, a tooltip box will also appear showing the percentage of donation received by gender and how much more or less it is comparing to overall aveage. 



##Feedback
My first sketch includes on a stacked bar chart, normalized to 100%, showing the condidates donations received by gender proportionally; however, the feedback I got was, while it shows the relative contributions by gender for each candidates, it's hard to compare candidates to the overall average. And another feedback I received was that, the stacked bar chart shows the relative political contributions, it's hard to see the absolute difference between candidates.

With these two feedbacks, I decided to draw a bar chart showing the total contribution amount by each candidates, and pie chart for each candidates and overall average. 

Soon my canvas got very crowded, and the third feedback I received was to make them animated: Let user decide who they want to focus on to compare, and placing a pie chart showing overall average inside a donut chart showing the gender distribution per candidate would render faster and easier comparison.



##Resources
1. Federal Election Comission: http://www.fec.gov/
2. Dimple JS Examples: http://dimplejs.org/examples_index.html
3. Stackover flow on how to draw labels for donut chart: http://stackoverflow.com/questions/28306308/how-to-draw-labels-on-dimple-js-donut-or-pie-chart
