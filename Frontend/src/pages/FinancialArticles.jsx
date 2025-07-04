import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const learningArticles = [
  {
    id: 1,
    title: "What is a Stock?",
    content: "<p>A stock, also known as equity, represents a share in the ownership of a company. When you purchase a company's stock, you're buying a small piece of that company, making you a shareholder. Companies issue stock to raise money for operations and expansion. There are two main types: common and preferred. Common stockholders typically have voting rights, while preferred stockholders usually don't but have a higher claim on assets and earnings.</p>",
    external_url: "https://www.investopedia.com/articles/investing/082614/how-stock-market-works.asp"
  },
  {
    id: 2,
    title: "Understanding Diversification",
    content: "<p>Diversification is an investment strategy that involves mixing a variety of investments within a portfolio. The goal is to reduce risk; if one investment performs poorly, the others may offset the loss. By spreading investments across various financial instruments, industries, and other categories, you can limit your exposure to any single asset or risk. It's a key component of long-term investing.</p>",
    external_url: "https://www.investor.gov/introduction-investing/investing-basics/diversifying-your-portfolio"
  },
  {
    id: 3,
    title: "Bull vs. Bear Markets",
    content: "<p>A <strong>bull market</strong> is a period of rising stock prices, typically characterized by optimism, investor confidence, and expectations of strong results. A <strong>bear market</strong> is the opposite, with falling prices and widespread pessimism. These trends can last for months or even years. Understanding the market's direction is crucial for making informed investment decisions.</p>",
    external_url: "https://www.forbes.com/advisor/investing/bull-market-vs-bear-market/"
  },
  {
    id: 4,
    title: "Introduction to Technical Analysis",
    content: "<p>Technical analysis is a trading discipline employed to evaluate investments and identify trading opportunities by analyzing statistical trends gathered from trading activity, such as price movement and volume. Unlike fundamental analysis, which attempts to evaluate a security's value based on business results, technical analysis focuses on charts of price movement and various analytical tools to evaluate a security's strength or weakness.</p>",
    external_url: "https://www.investopedia.com/terms/t/technicalanalysis.asp"
  },
  {
    id: 5,
    title: "The Power of Compound Interest",
    content: "<p>Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. Often called 'interest on interest,' it can significantly grow wealth over time. The earlier you start investing, the more powerful compounding becomes, which is why it's a cornerstone of long-term financial planning.</p>",
    external_url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator"
  },
  {
    id: 6,
    title: "Introduction to Fundamental Analysis",
    content: "<p>Fundamental analysis is a method of evaluating a security in an attempt to measure its intrinsic value, by examining related economic, financial, and other qualitative and quantitative factors. Fundamental analysts study anything that can affect the security's value, from macroeconomic factors such as the state of the economy and industry conditions to microeconomic factors like the company's management effectiveness.</p>",
    external_url: "https://www.investopedia.com/terms/f/fundamentalanalysis.asp"
  },
  {
    id: 7,
    title: "How to Read Stock Charts",
    content: "<p>Reading stock charts is a crucial skill for technical analysis. Key components of a chart include the price axis, time axis, volume bars, and various indicators like moving averages or RSI. Candlestick charts are popular, where each 'candle' shows the open, high, low, and close prices for a specific period. Patterns in these charts can help traders predict future price movements.</p>",
    external_url: "https://www.nerdwallet.com/article/investing/how-to-read-stock-charts"
  },
  {
    id: 8,
    title: "What Are Robo-Advisors?",
    content: "<p>Robo-advisors are digital platforms that provide automated, algorithm-driven financial planning services with little to no human supervision. A typical robo-advisor collects information from clients about their financial situation and future goals through an online survey and then uses the data to offer advice and automatically invest client assets.</p>",
    external_url: "https://www.investopedia.com/terms/r/roboadvisor-roboadviser.asp"
  },
  {
    id: 9,
    title: "What is an ETF?",
    content: "<p>An exchange-traded fund (ETF) is a type of security that involves a collection of securities—such as stocks—that often tracks an underlying index, although they can be invested in a number of industry sectors or use various strategies. ETFs are in many ways similar to mutual funds; however, they are listed on exchanges and ETF shares trade throughout the day just like ordinary stock.</p>",
    external_url: "https://www.investopedia.com/terms/e/etf.asp"
  },
  {
    id: 10,
    title: "Understanding P/E Ratio",
    content: "<p>The price-to-earnings (P/E) ratio is the ratio for valuing a company that measures its current share price relative to its per-share earnings. The P/E ratio is sometimes used as a proxy for the relative value of a company's stock. A high P/E could mean that a stock's price is high relative to earnings and possibly overvalued. Conversely, a low P/E might indicate that the current stock price is low relative to earnings.</p>",
    external_url: "https://www.investopedia.com/terms/p/price-earningsratio.asp"
  },
  {
    id: 11,
    title: "Introduction to Options Trading",
    content: "<p>Options are contracts that give the bearer the right, but not the obligation, to buy or sell an amount of some underlying asset at a pre-determined price at or before the contract expires. This can be a way to hedge against losses, or to speculate on price movements. Options are complex financial instruments and involve a high degree of risk.</p>",
    external_url: "https://www.investopedia.com/terms/o/option.asp"
  },
  {
    id: 12,
    title: "What Are Dividends?",
    content: "<p>Dividends are a distribution of a portion of a company's earnings, decided by the board of directors, to a class of its shareholders. Dividends can be issued as cash payments, as shares of stock, or other property. For investors, dividends can be a source of stable income and a sign of a company's financial health.</p>",
    external_url: "https://www.investopedia.com/terms/d/dividend.asp"
  },
  {
    id: 13,
    title: "Risk Tolerance and Investing",
    content: "<p>Risk tolerance is the degree of variability in investment returns that an investor is willing to withstand. Your risk tolerance is an important factor in choosing investments for your portfolio. It depends on several factors, including your age, financial goals, and your personal comfort with the possibility of losing money. It's generally categorized as aggressive, moderate, or conservative.</p>",
    external_url: "https://www.investor.gov/introduction-investing/investing-basics/evaluating-risk"
  },
  {
    id: 14,
    title: "Long-Term vs. Short-Term Investing",
    content: "<p>Long-term investing involves holding assets for a year or more, often with a focus on growth, dividends, or interest. Short-term investing involves buying and selling assets within a shorter time frame, such as a year, to make a quick profit. The strategies and risks associated with each are very different, and your choice depends on your financial goals and timeline.</p>",
    external_url: "https://www.forbes.com/advisor/investing/long-term-investing-vs-short-term-investing/"
  },
  {
    id: 15,
    title: "What is a Mutual Fund?",
    content: "<p>A mutual fund is a type of financial vehicle made up of a pool of money collected from many investors to invest in securities like stocks, bonds, money market instruments, and other assets. Mutual funds are operated by professional money managers, who allocate the fund\'s assets and attempt to produce capital gains or income for the fund\'s investors. A mutual fund\'s portfolio is structured and maintained to match the investment objectives stated in its prospectus.</p>",
    external_url: "https://www.investopedia.com/terms/m/mutualfund.asp"
  },
  {
    id: 16,
    title: "Understanding Market Capitalization",
    content: "<p>Market capitalization refers to the total dollar market value of a company\'s outstanding shares of stock. Commonly referred to as 'market cap,' it is calculated by multiplying the total number of a company\'s outstanding shares by the current market price of one share. The investment community uses this figure to determine a company\'s size, as opposed to using sales or total asset figures.</p>",
    external_url: "https://www.investopedia.com/terms/m/marketcapitalization.asp"
  },
  {
    id: 17,
    title: "The Psychology of Investing",
    content: "<p>The psychology of investing refers to the various cognitive and emotional factors that can influence investors\' decision-making. Common biases include overconfidence, loss aversion, and herd behavior. Understanding these psychological pitfalls can help investors make more rational, objective decisions and avoid common investing mistakes.</p>",
    external_url: "https://www.investopedia.com/articles/investing/062515/psychology-investing.asp"
  },
  {
    id: 18,
    title: "What are Bonds?",
    content: "<p>A bond is a fixed-income instrument that represents a loan made by an investor to a borrower (typically corporate or governmental). A bond could be thought of as an I.O.U. between the lender and borrower that includes the details of the loan and its payments. Bonds are used by companies, municipalities, states, and sovereign governments to finance projects and operations. Owners of bonds are debtholders, or creditors, of the issuer.</p>",
    external_url: "https://www.investopedia.com/terms/b/bond.asp"
  },
  {
    id: 19,
    title: "Reading Financial Statements",
    content: "<p>Financial statements are written records that convey the business activities and the financial performance of a company. The three main financial statements are the balance sheet, the income statement, and the statement of cash flows. These statements are an essential part of financial reporting and are used by investors, creditors, and management to make informed decisions about the company.</p>",
    external_url: "https://www.investopedia.com/terms/f/financial-statements.asp"
  }
];

const FinancialArticles = () => {
  const [expandedArticle, setExpandedArticle] = useState(null);

  const toggleArticle = (id) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link to="/dashboard" className="text-teal-400 hover:text-teal-300 transition-colors inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </Link>
      </motion.div>

      <header className="text-center mb-16">
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold text-white mb-3 tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Financial Learning Center
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-400"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Empower your investment journey with curated financial knowledge.
        </motion.p>
      </header>

      <div className="max-w-4xl mx-auto">
        {learningArticles.map((article, index) => (
          <motion.div
            key={article.id}
            className="mb-4 bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => toggleArticle(article.id)}
              className="w-full text-left p-6 focus:outline-none transition-colors flex justify-between items-center"
            >
              <h2 className="text-xl font-bold text-teal-400">{article.title}</h2>
              <motion.div
                animate={{ rotate: expandedArticle === article.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
            {expandedArticle === article.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-gray-800 border-t border-gray-700"
              >
                <div className="p-6">
                  <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: article.content }} />
                  {article.external_url && (
                    <a
                      href={article.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-6 text-teal-400 hover:text-teal-300 font-semibold transition-colors"
                    >
                      Read Full Article <FaExternalLinkAlt className="ml-2" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FinancialArticles;
