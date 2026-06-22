import { resources } from "./Resources";
import { PAYMENT_QR_CODE } from "../config/payment";

export const paidBookMeta = {
  31: {
    price: 3.0,
    description:
      "Clean Code teaches you how to write readable, maintainable software. Robert C. Martin shares practical rules and examples for naming, functions, comments, and refactoring so your code stays easy to work with over time."
  },
  32: {
    price: 3.0,
    description:
      "The Pragmatic Programmer teaches practical software development habits, focusing on problem-solving, code quality, and long-term thinking for developers."
  },
  33: {
    price: 4.0,
    description:
      "Design Patterns introduces reusable solutions to common software design problems, helping developers build flexible and maintainable applications."
  },
  34: {
    price: 3.5,
    description:
      "Refactoring shows how to safely improve existing code structure to make it cleaner, more efficient, and easier to maintain."
  },
  37: {
    price: 3.0,
    description:
      "Cracking the Coding Interview prepares you for technical interviews with hundreds of programming questions, solutions, and strategies for problem-solving, data structures, and algorithms.",
  },
  38: {
    price: 6.0,
    description:
      "The Art of Computer Programming is a deep mathematical exploration of algorithms and computational theory by Donald Knuth."
  },
  41: {
    price: 4.0,
    description:
      "Artificial Intelligence: A Modern Approach explains core AI concepts such as search, logic, planning, and intelligent agents."
  },
  43: {
    price: 4.5,
    description:
      "Deep Learning is a comprehensive textbook covering neural networks, optimization, convolutional networks, sequence modeling, and modern AI research. Ideal for students and practitioners building a strong theoretical foundation.",
  },
  44: {
    price: 3.5,
    description:
      "Hands-On Machine Learning provides practical guidance for building real AI models using Python, Scikit-Learn, and TensorFlow."
  },
  48: {
    price: 3.0,
    description:
      "Reinforcement Learning: An Introduction explains how machines learn by interacting with environments using rewards and penalties."
  },
  49: {
    price: 3.5,
    description:
      "Mathematics for Machine Learning covers essential math topics like linear algebra and probability for AI understanding."
  },
  52: {
    price: 2.5,
    description:
      "Discrete Mathematics introduces logic, sets, graphs, and proofs that form the foundation of computer science."
  },
  57: {
    price: 3.0,
    description:
      "Data Mining: Concepts and Techniques explains how to extract patterns and knowledge from large datasets."
  },
  59: {
    price: 4.0,
    description:
      "Designing Data-Intensive Applications explores how modern systems handle storage, processing, and reliability at scale. Essential reading for backend engineers and system designers.",
  },
  61: {
    price: 3.5,
    description:
      "Domain-Driven Design focuses on structuring software based on real-world business logic and domain understanding."
  },
  62: {
    price: 3.0,
    description:
      "Microservices Patterns teaches how to design scalable distributed systems using independent services."
  },
  63: {
    price: 3.5,
    description:
      "Building Microservices explains how to create, deploy, and manage microservice-based applications."
  },
  65: {
    price: 4.0,
    description:
      "Kubernetes in Action teaches how to deploy and manage containerized applications in real-world systems."
  },
  66: {
    price: 3.0,
    description:
      "The DevOps Handbook explains how to improve collaboration between development and operations teams for faster delivery."
  },
  67: {
    price: 4.0,
    description:
      "Site Reliability Engineering introduces how Google manages large-scale systems with reliability and automation."
  },
  69: {
    price: 2.5,
    description:
      "Test-Driven Development teaches writing tests before code to improve software quality and reduce bugs."
  },
  72: {
    price: 3.0,
    description:
      "Code Complete is a guide to writing high-quality software with best practices for construction and design."
  },
  75: {
    price: 2.0,
    description:
      "Eloquent JavaScript teaches modern JavaScript programming with clear explanations and practical exercises."
  },
  79: {
    price: 2.5,
    description:
      "Learning SQL teaches how to query, manage, and analyze data using relational databases."
  },
  101: {
    price: 2.5,
    description:
      "The Hobbit follows Bilbo Baggins on an unexpected journey with dwarves and Gandalf to reclaim treasure guarded by the dragon Smaug. A timeless fantasy adventure and prelude to The Lord of the Rings.",
  },
  105: {
    price: 3.0,
    description:
      "Dune is set on the desert planet Arrakis, where politics, ecology, and prophecy collide. Paul Atreides must navigate betrayal and destiny in one of science fiction's most influential epics.",
  },
  106: {
    price: 2.0,
    description:
      "The Hunger Games is set in Panem, where Katniss Everdeen volunteers for a televised fight to the death to save her sister. A gripping dystopian novel about survival, sacrifice, and rebellion.",
  },
  123: {
    price: 2.0,
    description:
      "Atomic Habits explains how small, consistent changes compound into remarkable results. James Clear offers practical strategies for building good habits, breaking bad ones, and improving daily systems.",
  },
  131: {
    price: 2.5,
    description:
      "Sapiens traces the history of humankind from the Cognitive Revolution to the present, exploring how biology and culture shaped societies, economies, and the world we live in today.",
  },
  151: {
    price: 3.5,
    description:
      "The Martian tells the story of astronaut Mark Watney, stranded on Mars and forced to survive using science, ingenuity, and humor while NASA races to bring him home.",
  },
};

export function enrichBook(book) {
  const meta = paidBookMeta[Number(book.id)];
  return {
    ...book, // Spreads original properties (including original 'status')
    description:
      meta?.description ??
      `"${book.title}" is a ${book.type.toLowerCase()} resource in our library collection. Browse the details below and borrow it when available.`,
    requiresPayment: Boolean(meta),
    price: meta?.price ?? 0,
    isPremium: !!meta,
    qrCode: meta?.qrCode ?? PAYMENT_QR_CODE,
    // status: "Available" <-- Removed so it doesn't smash book.status from Resources.js
  };
}

export function getEnrichedResources() {
  return resources.map(enrichBook);
}

export function getBookById(id) {
  const book = resources.find((b) => b.id === Number(id));
  return book ? enrichBook(book) : null;
}