import { NextResponse } from "next/server";
import { scrapeUrl } from "@/utils/scraper";
import { getGeminiResponse } from "@/utils/gemini";
import { Logger } from "@/utils/logger";

const logger = new Logger("analyze-resume-route");

// Hardcoded resume text - in a real app this would come from the user
const RESUME_TEXT = `
Faizan Ahmed  
faizan@theheadstarter.com | (347) 238-6332 | Lynbrook, NY | LinkedIn | GitHub  
 
EDUCATION:  Master of Science in Data Science, St. John’s University, Queens, New York               2022-2023     
Bachelor of Science in Computer Science, St. John’s University, Queens, New York                             2018-2022 

EXPERIENCE: 
Headstarter – Co-Founder & Head of Machine Learning, New York, NY                                                                    Oct 2022 – Present 
• Developed the core technology, business plan, and team to raise over $500k in funding from venture capital and angel investors  
• Created a multimodal AI agent capable of speaking, coding, and reacting to a user’s facial emotions to teach Computer Science 
• Fine-tuned a custom large language model based on proprietary user data, deployed on our own cloud servers for low latency  
• Spearheaded efforts to build out the data science infrastructure, worked with Software Engineers to ensure high-quality and clean 
data collection through AWS DynamoDB, identified key new data points to be captured on users to feed to ML models  
• Constructed a pipeline with OpenAI GPT-4, Pinecone, and LangChain to generate tailored content based on a user’s skill level 
• Collaborated with UI/UX designers to develop user-friendly interfaces and visualizations, optimized for user retention   
• Built dashboards with Python and Mixpanel API to display KPIs on user engagement data, identified key areas of improvement   
• Implemented functions in TypeScript to parse audio files and generate personalized text & audio feedback through multiple APIs  

Amazon - Business Intelligence Engineer Intern, Seattle, WA                                                                                           June 2022 – Sep 2022 
• Collaborated with data scientists to develop and deploy a large-scale machine learning model in AWS SageMaker using Python, 
Spark, and Hadoop to identify customers that are most likely to increase sales, projected to increase profit by $80M 
• Utilized feature engineering techniques and statistical / exploratory data analysis to filter and clean raw data from over 100M 
customers, fed data to XGBoost model and performed hyperparameter tuning to maximize accuracy 
• Implemented machine learning techniques to identify patterns and trends in customer data and improve marketing efforts 
• Managed the data science project lifecycle, from ideation to implementation, using agile methodologies and documentation  
• Wrote and optimized SQL queries and ETL pipelines to aggregate customer data from AWS Redshift and Big Data warehouse 
• Developed SQL queries and Tableau dashboards that allows business leaders to A/B test marketing campaigns 
• Extracted meaningful business insights from data and present & communicate key takeaways to leadership and stakeholders  
 
Bloomberg LP - Global Data Analyst Intern, New York, NY                                                                                        June 2021 – August 2021 
• Utilized Python and Bloomberg Query Language (BQL) to automate a data extraction workflow and reduced time costs by 60% 
• Developed an interactive data visualization tool using Python to efficiently compare equities and automate manual research 
• Led a team of 5 interns to create a dynamic UI with HTML & JavaScript to optimize a workflow, reduced time spent by 50%  
• Created a dynamic news automation template with Python to easily find and generate news stories around similar companies 
• Aggregated data through Bloomberg's API and built dashboards to facilitate data driven decision-making among stakeholders  
Google Developer Student Club - Engineering Team Lead, Queens, NY          Oct 2021 – March 2022 
•  Led a team of 8 students to create a scalable full stack mobile application with Flutter and Firebase through agile development 
•  Designed data models and pipelines to process unstructured data, developed queries to analyze user data from NoSQL database 
•  Held weekly meetings to handle code reviews, pull requests on GitHub, update and assign Jira tasks, and plan out code sprints 
•  Engaged and collaborated with designers, product managers, and external stakeholders to optimize the user experience  
•  
St. John’s University ACM Student Chapter – President | Website Link | Queens, NY            Sep 2020 – May 2022 
•  Facilitated meetings and workshops to provide technical knowledge to over 100 students and managed an e-board of 8 students  
•  Directed the advancement of the Computer Science department through collaboration with Professors and professionals 
•  Designed and developed a fully responsive website using React JS for the club and trained members on how to make updates 
•  Deployed website using Netlify and set up CI/CD pipelines through Git and GitHub for automatic updates   

PROJECTS: 
NLP Recommendation System                                               2023 
• Architected and developed an end-to-end machine learning pipeline for a recommendation system for a website. Utilized state-of-
the-art NLP techniques with NLTK, Spacy, HuggingFace Transformers, and deep neural networks for high efficacy 
Automated COVID-19 Detection with Deep Learning | Publication Link | Citations: 27            2021 
• Utilized Tensorflow and Keras to create a deep learning model in Python capable of detecting and differentiating between 
instances of COVID-19 and Viral Pneumonia in x-ray images with an accuracy of 93%. Published in ACM Digital Government.  
Spotify Music Recommendations                                               2021 
• Built a web app in Python that utilizes machine learning to recommend songs based on the user’s favorite artists, songs, and 
listening history using the Spotify API. Created data visualizations and a dynamic user experience based on their music preferences 
Financial Statement Screener                 2021 
• Employed web scraping and NLP techniques in Python to scrape data from 1000s of financial statements and government 
contracts to form investment insights, recommendations, and data visualizations   
SKILLS: 
•  Python, Java, JavaScript, TypeScript, React JS, Node JS, R, SQL, Amazon Web Services (AWS), Google Firebase, MongoDB 
•  PowerBI, Tableau, CI/CD, Spark, Hadoop, Jira, AWS SageMaker, AWS Lambda, S3, Redshift, Tensorflow, Pandas, Docker, PyTorch 
•  Certifications: JPMorgan Chase Software Engineering Virtual Experience
`;

export async function POST(req: Request) {
  try {
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: "URLs array is required" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      urls.map(async url => {
        try {
          // Scrape the webpage
          const scrapedContent = await scrapeUrl(url);

          if (scrapedContent.error) {
            return {
              url,
              relevanceScore: 0,
              explanation: `Error: ${scrapedContent.error}`,
            };
          }

          // Prepare message for Gemini
          const messages = [
            {
              role: "system" as const,
              content:
                "You are a job matching assistant. Analyze the webpage content and compare it to my resume. Return a JSON object with a relevance score (0-100) and explanation. Focus on matching skills, experience, and job requirements.",
            },
            {
              role: "user" as const,
              content: `Compare the contents of my resume with the information about the company and rate how relevant it is. Determine how good of a fit I would be for a job at this company.


            <Resume>
            ${RESUME_TEXT}
            </Resume>

            <WebpageContent>
            ${scrapedContent.content}
            </WebpageContent>

            Return a JSON object with:
            1. relevanceScore (0-100) - how good of a fit I would be for a job at this company
            2. explanation (2-3 sentences explaining the score) - why the score is what it is
            `,
            },
          ];

          // Get AI analysis
          const analysis = await getGeminiResponse(messages);
          const parsedAnalysis = JSON.parse(analysis);

          return {
            url,
            relevanceScore: parsedAnalysis.relevanceScore,
            explanation: parsedAnalysis.explanation,
          };
        } catch (error) {
          logger.error(`Error analyzing URL ${url}:`, error);
          return {
            url,
            relevanceScore: 0,
            explanation: `Error analyzing URL: ${error instanceof Error ? error.message : "Unknown error"}`,
          };
        }
      })
    );

    // Sort results by relevanceScore in descending order
    const sortedResults = results.sort(
      (a, b) => b.relevanceScore - a.relevanceScore
    );

    return NextResponse.json({ results: sortedResults });
  } catch (error) {
    logger.error("Error in analyze-resume route:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume match" },
      { status: 500 }
    );
  }
}
