import { HumanChatMessage } from 'langchain/schema'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { calculateAverage, extractOuterObject, getWordCountWeight } from '@/utils/api'

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.1,
  callbacks: [
    {
      handleLLMStart: async (llm, prompts) => {
        console.log(JSON.stringify(llm, null, 2))
        console.log(JSON.stringify(prompts, null, 2))
      },
      handleLLMEnd: async (output) => {
        console.log(JSON.stringify(output, null, 2))
      },
      handleLLMError: async (err) => {
        console.error(err)
      },
    },
  ],
  timeout: 180000,
})

async function score(question, answer) {
  const response = await chat.call([
    new HumanChatMessage(
      `
      This is an IELTS writing question and scoring rules. Please analyze and rate the answer according to the rules and question. 
      ———————————
      This is the question: ${question}.
      ———————————
      This is the answer: ${answer}.
      ———————————
      This is the rules:
         1.Task Achievement:
          explanation: Task Achievement refers to your ability to answer the question properly. In order to do this you have to do all the things the question asks you to do and write a clear, well developed answer.
          score: 9, standard: The prompt is appropriately addressed and explored in depth. A clear and fully developed position is presented which directly answers the question/s. Ideas are relevant, fully extended and well supported. Any lapses in content or support are extremely rare.
          score: 8, standard: The prompt is appropriately and sufficiently addressed. A clear and well-developed position is presented in response to the question/s. Ideas are relevant, well extended and supported. There may be occasional omissions or lapses in content.
          score: 7, standard: The main parts of the prompt are appropriately addressed. A clear and developed position is presented. Main ideas are extended and supported, but there may be a tendency to over-generalize or a lack of focus and precision in supporting ideas/material.
          score: 6, standard: The main parts of the prompt are addressed (though some may be more fully covered than others). An appropriate format is used. A position is presented that is directly relevant to the prompt, although the conclusions drawn may be unclear, unjustified or repetitive. Main ideas are relevant, but some may be insufficiently developed or may lack clarity, while some supporting arguments and evidence may be less relevant or inadequate.
          score: 5, standard: The main parts of the prompt are incompletely addressed. The format may be inappropriate in places. The writer expresses a position, but the development is not always clear. Some main ideas are put forward, but they are limited and not sufficiently developed, and/or there may be irrelevant detail. There may be some repetition.
          score: 4, standard: The prompt is tackled in a minimal way, or the answer is tangential, possibly due to some misunderstanding of the prompt. The format may be inappropriate. A position is discernible, but the reader has to read carefully to find it. Main ideas are difficult to identify, and such ideas that are identifiable may lack relevance, clarity, and/or support. Large parts of the response may be repetitive.
          score: 3, standard: No part of the prompt is adequately addressed, or the prompt has been misunderstood. No relevant position can be identified, and/or there is little direct response to the question/s. There are few ideas, and these may be irrelevant or insufficiently developed.
          score: 2, standard: The content is barely related to the prompt. No position can be identified. There may be glimpses of one or two ideas without development.
          score: 1, standard: Responses of 20 words or fewer are rated at Band 1. The content is wholly unrelated to the prompt. Any copied rubric must be discounted.
        2.Coherence & Cohesion:
          explanation: coherence means the connection of ideas on a larger scale, while cohesion means connection at a sentence level.
          score: 9, standard: The message can be followed effortlessly. Cohesion is used in such a way that it very rarely attracts attention. Any lapses in coherence or cohesion are minimal. Paragraphing is skilfully managed.
          score: 8, standard: The message can be followed with ease. Information and ideas are logically sequenced, and cohesion is well managed. Occasional lapses in coherence and cohesion may occur. Paragraphing is used sufficiently and appropriately.
          score: 7, standard: Information and ideas are logically organised, and there is a clear progression throughout the response. (A few lapses may occur, but these are minor.) A range of cohesive devices including reference and substitution is used flexibly but with some inaccuracies or some over/under use. Paragraphing is generally used effectively to support overall coherence, and the sequencing of ideas within a paragraph is generally logical.
          score: 6, standard: Information and ideas are generally arranged coherently, and there is a clear overall progression. Cohesive devices are used to some good effect, but cohesion within and/or between sentences may be faulty or mechanical due to misuse, overuse, or omission. The use of reference and substitution may lack flexibility or clarity and result in some repetition or error. Paragraphing may not always be logical, and/or the central topic may not always be clear.
          score: 5, standard: Organisation is evident but is not wholly logical, and there may be a lack of overall progression. Nevertheless, there is a sense of underlying coherence to the response. The relationship of ideas can be followed, but the sentences are not fluently linked to each other. There may be limited/overuse of cohesive devices with some inaccuracy. The writing may be repetitive due to inadequate and/or inaccurate use of reference and substitution. Paragraphing may be inadequate or missing.
          score: 4, standard: Information and ideas are evident but not arranged coherently, and there is no clear progression within the response. Relationships between ideas can be unclear and/or inadequately marked. There is some use of basic cohesive devices, which may be inaccurate or repetitive. There is inaccurate use or a lack of substitution or referencing. There may be no paragraphing and/or no clear main topic within paragraphs.
          score: 3, standard: There is no apparent logical organisation. Ideas are discernible but difficult to relate to each other. There is minimal use of sequencers or cohesive devices. Those used do not necessarily indicate a logical relationship between ideas. There is difficulty in identifying referencing. Any attempts at paragraphing are unhelpful.
          score: 2, standard: There is little relevant message, or the entire response may be off-topic. There is little evidence of control of organisational features.
          score: 1, standard: Responses of 20 words or fewer are rated at Band 1. The writing fails to communicate any message and appears to be by a virtual non-writer.
        3.Lexical Resource:
          explanation: Lexical resource is all about how flexibly and fluently you can find the right words and phrases to convey precise meanings.
          score: 9, standard: Full flexibility and precise use are widely evident. A wide range of vocabulary is used accurately and appropriately with very natural and sophisticated control of lexical features. Minor errors in spelling and word formation are extremely rare and have minimal impact on communication.
          score: 8, standard: A wide resource is fluently and flexibly used to convey precise meanings. There is skilful use of uncommon and/or idiomatic items when appropriate, despite occasional inaccuracies in word choice and collocation. Occasional errors in spelling and/or word formation may occur, but have minimal impact on communication.
          score: 7, standard: The resource is sufficient to allow some flexibility and precision. There is some ability to use less common and/or idiomatic items. An awareness of style and collocation is evident, though inappropriacies occur. There are only a few errors in spelling and/or word formation, and they do not detract from overall clarity.
          score: 6, standard: The resource is generally adequate and appropriate for the task. The meaning is generally clear in spite of a rather restricted range or a lack of precision in word choice. If the writer is a risk-taker, there will be a wider range of vocabulary used but higher degrees of inaccuracy or inappropriacy. There are some errors in spelling and/or word formation, but these do not impede communication.
          score: 5, standard: The resource is limited but minimally adequate for the task. Simple vocabulary may be used accurately, but the range does not permit much variation in expression. There may be frequent lapses in the appropriacy of word choice, and a lack of flexibility is apparent in frequent simplifications and/or repetitions. Errors in spelling and/or word formation may be noticeable and may cause some difficulty for the reader.
          score: 4, standard: The resource is limited and inadequate for or unrelated to the task. Vocabulary is basic and may be used repetitively. There may be inappropriate use of lexical chunks (e.g., memorized phrases, formulaic language, and/or language from the input material). Inappropriate word choice and/or errors in word formation and/or in spelling may impede meaning.
          score: 3, standard: The resource is inadequate (which may be due to the response being significantly underlength). Possible over-dependence on input material or memorized language. Control of word choice and/or spelling is very limited, and errors predominate. These errors may severely impede meaning.
          score: 2, standard: The resource is extremely limited with few recognizable strings, apart from memorized phrases. There is no apparent control of word formation and/or spelling.
          score: 1, standard: Responses of 20 words or fewer are rated at Band 1. No resource is apparent, except for a few isolated words.
        4.Grammatical Range & Accuracy:
          explanation: The ability to use correct and precise grammar with control. Mistakes that impact communication are considered more severe mistakes. Grammatical Range: Being able to use a variety of sentence structures, tenses, and other items to convey intended meaning.
          score: 9, standard: A wide range of structures is used with full flexibility and control. Punctuation and grammar are used appropriately throughout. Minor errors are extremely rare and have minimal impact on communication.
          score: 8, standard: A wide range of structures is flexibly and accurately used. The majority of sentences are error-free, and punctuation is well managed. Occasional, non-systematic errors and inappropriacies occur, but have minimal impact on communication.
          score: 7, standard: A variety of complex structures is used with some flexibility and accuracy. Grammar and punctuation are generally well controlled, and error-free sentences are frequent. A few errors in grammar may persist, but these do not impede communication.
          score: 6, standard: A mix of simple and complex sentence forms is used, but flexibility is limited. Examples of more complex structures are not marked by the same level of accuracy as in simple structures. Errors in grammar and punctuation occur, but rarely impede communication.
          score: 5, standard: The range of structures is limited and rather repetitive. Although complex sentences are attempted, they tend to be faulty, and the greatest accuracy is achieved on simple sentences. Grammatical errors may be frequent and cause some difficulty for the reader. Punctuation may be faulty.
          score: 4, standard: A very limited range of structures is used. Subordinate clauses are rare, and simple sentences predominate. Some structures are produced accurately, but grammatical errors are frequent and may impede meaning. Punctuation is often faulty or inadequate.
          score: 3, standard: Sentence forms are attempted, but errors in grammar and punctuation predominate (except in memorized phrases or those taken from the input material). This prevents most meaning from coming through. Length may be insufficient to provide evidence of control of sentence forms.
          score: 2, standard: There is little or no evidence of sentence forms (except in memorized phrases).
          score: 1, standard: Responses of 20 words or fewer are rated at Band 1. No rateable language is evident.
      ———————————
      This is the result example:
      {
        "Task Achievement": {
          "score": 8,
          "comment": "文章涉及了xxx观点，表达了xxx内容，结论中表达了xxxx的观点，并认为从xxxx。"
        },
        "Coherence & Cohesion": {
          "score": 7,
          "comment": "文章在整体结构上比较清晰，包含了引言、正文和结论。引言引出了主题，并提到了利弊两个方面。结论总结了文章观点，并进一步说明了好处大于弊端的理由。"
        },
        "Lexical Resource": {
          "score": 2,
          "comment": "一些单词的拼写和用法有错误，例如“object”应为“objective”。"
        },
        "Grammatical Range & Accuracy":  {
          "score": 3,
          "comment": "句子结构有时不够清晰，导致理解起来有些困难。有一些句子需要重新组织和修复语法错误，以提高表达的准确性和流畅性。"
        },
      }
     ———————————
      The comment corresponding to each score in the returned result only uses the comment content corresponding to this score in the rules. Please just give me a final JSON directly like the result example.
      请参考规则给出分数和评语，返回结果中的评语全部使用中文
      `
      ,
    ),
  ])

  return response
}

export default async function handler(req, res) {
  try {
    const { question, answer } = req.body // 获取请求体中的data字段
    const scoreResponse = await score(question, answer)
    const scoreMessage = extractOuterObject(scoreResponse.text)
    const wordCountWeight = getWordCountWeight(answer)
    let totalScore = 0
    Object.values(scoreMessage).forEach((item) => {
      const roundedScore = Math.round(item.score * wordCountWeight)
      item.score = roundedScore
      totalScore += roundedScore
    })
    scoreMessage['final score'] = calculateAverage(totalScore)
    // 校验下返回的字段
    if (scoreMessage && scoreMessage['Task Achievement'] && scoreMessage['Coherence & Cohesion'] && scoreMessage['Lexical Resource'] && scoreMessage['Grammatical Range & Accuracy'])
      res.status(200).json(scoreMessage)
    else
      res.status(400).json({ error: 'score字段不正确' })
  }
  catch (error) {
    res.status(500).json({ error })
  }
}
