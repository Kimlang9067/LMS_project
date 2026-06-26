import { resources } from "./Resources";
import { PAYMENT_QR_CODE } from "../config/payment";

const BOOK_EXTRA = {
  1:  { author: 'Mehryar Mohri et al.',              category: 'AI & Machine Learning',  publisher: 'MIT Press' },
  2:  { author: 'Wes McKinney',                       category: 'Data Science',            publisher: "O'Reilly Media" },
  3:  { author: 'Eli Stevens & Luca Antiga',          category: 'Deep Learning',           publisher: 'Manning' },
  4:  { author: 'Stuart Russell & Peter Norvig',      category: 'Artificial Intelligence', publisher: 'Pearson' },
  5:  { author: 'Andrew Ng',                          category: 'Machine Learning',        publisher: 'Coursera' },
  6:  { author: 'Thomas H. Cormen et al.',            category: 'Algorithms',              publisher: 'GeeksforGeeks' },
  7:  { author: 'James F. Kurose & Keith Ross',       category: 'Networking',              publisher: 'Pearson' },
  8:  { author: 'Abraham Silberschatz et al.',        category: 'Operating Systems',       publisher: 'Wiley' },
  9:  { author: 'Raghu Ramakrishnan',                 category: 'Databases',               publisher: 'McGraw-Hill' },
  10: { author: 'Ian Sommerville',                    category: 'Software Engineering',    publisher: 'Pearson' },
  11: { author: 'Wes Bos',                            category: 'Web Development',         publisher: 'Self-Published' },
  12: { author: 'Marijn Haverbeke',                   category: 'JavaScript',              publisher: 'No Starch Press' },
  13: { author: 'James Gosling et al.',               category: 'Programming',             publisher: 'Oracle' },
  14: { author: 'Stanley B. Lippman',                 category: 'Programming',             publisher: 'Addison-Wesley' },
  15: { author: 'Chuck Easttom',                      category: 'Cybersecurity',           publisher: 'Cisco Press' },
  16: { author: 'Arshdeep Bahga',                     category: 'Cloud Computing',         publisher: 'VPT' },
  17: { author: 'Rick Smolan & Jennifer Erwitt',      category: 'Big Data',                publisher: 'Against All Odds' },
  18: { author: 'Carl Shan et al.',                   category: 'Data Science',            publisher: 'Blurb' },
  19: { author: 'Alan Dix et al.',                    category: 'HCI',                     publisher: 'Pearson' },
  20: { author: 'Reto Meier',                         category: 'Mobile Development',      publisher: "O'Reilly Media" },
  21: { author: 'Marijn Haverbeke et al.',            category: 'Web Development',         publisher: 'Full Stack Open' },
  22: { author: 'Andrew S. Tanenbaum',                category: 'Networking',              publisher: 'Pearson' },
  23: { author: 'M. Morris Mano',                     category: 'Digital Design',          publisher: 'Pearson' },
  24: { author: 'David A. Patterson',                 category: 'Computer Architecture',   publisher: 'Elsevier' },
  25: { author: 'Kenneth E. Kendall',                 category: 'Systems Analysis',        publisher: 'Pearson' },
  26: { author: 'Harold Kerzner',                     category: 'Project Management',      publisher: 'Wiley' },
  27: { author: 'Thomas H. Cormen',                   category: 'Algorithms',              publisher: 'MIT Press' },
  28: { author: 'Herb Mattord',                       category: 'Network Security',        publisher: 'Cengage' },
  29: { author: 'Don & Alex Tapscott',                category: 'Technology',              publisher: 'Portfolio' },
  30: { author: 'Samuel Greengard',                   category: 'Technology',              publisher: 'MIT Press' },
  31: { author: 'Robert C. Martin',                   category: 'Software Engineering',    publisher: 'Prentice Hall' },
  32: { author: 'David Thomas & Andrew Hunt',         category: 'Software Engineering',    publisher: 'Addison-Wesley' },
  33: { author: 'Gang of Four',                       category: 'Design Patterns',         publisher: 'Addison-Wesley' },
  34: { author: 'Martin Fowler',                      category: 'Software Engineering',    publisher: 'Addison-Wesley' },
  35: { author: 'Robert C. Martin',                   category: 'Software Engineering',    publisher: 'Prentice Hall' },
  36: { author: 'Thomas H. Cormen et al.',            category: 'Algorithms',              publisher: 'MIT Press' },
  37: { author: 'Gayle Laakmann McDowell',            category: 'Coding Interviews',       publisher: 'CareerCup' },
  38: { author: 'Donald E. Knuth',                    category: 'Computer Science',        publisher: 'Addison-Wesley' },
  39: { author: 'Harold Abelson & Gerald Sussman',    category: 'Computer Science',        publisher: 'MIT Press' },
  40: { author: 'Alfred V. Aho et al.',               category: 'Compilers',               publisher: 'Pearson' },
  41: { author: 'Stuart Russell & Peter Norvig',      category: 'Artificial Intelligence', publisher: 'Pearson' },
  42: { author: 'Christopher M. Bishop',              category: 'Machine Learning',        publisher: 'Springer' },
  43: { author: 'Ian Goodfellow et al.',              category: 'Deep Learning',           publisher: 'MIT Press' },
  44: { author: 'Aurélien Géron',                     category: 'Machine Learning',        publisher: "O'Reilly Media" },
  45: { author: 'Steven Bird et al.',                 category: 'NLP',                     publisher: "O'Reilly Media" },
  46: { author: 'Daniel Jurafsky & James H. Martin',  category: 'NLP',                     publisher: 'Pearson' },
  47: { author: 'Richard Szeliski',                   category: 'Computer Vision',         publisher: 'Springer' },
  48: { author: 'Richard S. Sutton & Andrew Barto',   category: 'AI & Machine Learning',   publisher: 'MIT Press' },
  49: { author: 'Marc Peter Deisenroth et al.',       category: 'Mathematics',             publisher: 'Cambridge UP' },
  50: { author: 'Gilbert Strang',                     category: 'Mathematics',             publisher: 'Cengage' },
  51: { author: 'Ronald Walpole et al.',              category: 'Statistics',              publisher: 'Pearson' },
  52: { author: 'Kenneth H. Rosen',                   category: 'Mathematics',             publisher: 'McGraw-Hill' },
  53: { author: 'James Stewart',                      category: 'Mathematics',             publisher: 'Cengage' },
  54: { author: 'Trevor Hastie et al.',               category: 'Statistics',              publisher: 'Springer' },
  55: { author: 'Allen B. Downey',                    category: 'Statistics',              publisher: "O'Reilly Media" },
  56: { author: 'Sebastian Raschka',                  category: 'Machine Learning',        publisher: 'Packt' },
  57: { author: 'Jiawei Han et al.',                  category: 'Data Mining',             publisher: 'Elsevier' },
  58: { author: 'Jure Leskovec et al.',               category: 'Data Mining',             publisher: 'Cambridge UP' },
  59: { author: 'Martin Kleppmann',                   category: 'Databases',               publisher: "O'Reilly Media" },
  60: { author: 'Robert C. Martin',                   category: 'Software Architecture',   publisher: 'Prentice Hall' },
  61: { author: 'Eric Evans',                         category: 'Software Architecture',   publisher: 'Addison-Wesley' },
  62: { author: 'Chris Richardson',                   category: 'Microservices',           publisher: 'Manning' },
  63: { author: 'Sam Newman',                         category: 'Microservices',           publisher: "O'Reilly Media" },
  64: { author: 'Nigel Poulton',                      category: 'DevOps',                  publisher: 'Self-Published' },
  65: { author: 'Marko Lukša',                        category: 'DevOps',                  publisher: 'Manning' },
  66: { author: 'Gene Kim et al.',                    category: 'DevOps',                  publisher: 'IT Revolution' },
  67: { author: 'Betsy Beyer et al.',                 category: 'Site Reliability',        publisher: "O'Reilly Media" },
  68: { author: 'Jez Humble & David Farley',          category: 'DevOps',                  publisher: 'Addison-Wesley' },
  69: { author: 'Kent Beck',                          category: 'Testing',                 publisher: 'Addison-Wesley' },
  70: { author: 'Robert C. Martin et al.',            category: 'Software Engineering',    publisher: 'Pearson' },
  71: { author: 'Frederick P. Brooks Jr.',            category: 'Software Engineering',    publisher: 'Addison-Wesley' },
  72: { author: 'Steve McConnell',                    category: 'Software Engineering',    publisher: 'Microsoft Press' },
  73: { author: 'Eric Freeman et al.',                category: 'Design Patterns',         publisher: "O'Reilly Media" },
  74: { author: 'Douglas Crockford',                  category: 'JavaScript',              publisher: "O'Reilly Media" },
  75: { author: 'Marijn Haverbeke',                   category: 'JavaScript',              publisher: 'No Starch Press' },
  76: { author: 'Kyle Simpson',                       category: 'JavaScript',              publisher: "O'Reilly Media" },
  77: { author: 'Basarat Ali Syed',                   category: 'TypeScript',              publisher: 'Gitbook' },
  78: { author: 'Mario Casciaro & Luciano Mammino',   category: 'Node.js',                 publisher: 'Packt' },
  79: { author: 'Alan Beaulieu',                      category: 'Databases',               publisher: "O'Reilly Media" },
  80: { author: 'Regina Obe & Leo Hsu',               category: 'Databases',               publisher: "O'Reilly Media" },
  81: { author: 'Kristina Chodorow',                  category: 'Databases',               publisher: "O'Reilly Media" },
  82: { author: 'Josiah Carlson',                     category: 'Databases',               publisher: 'Manning' },
  83: { author: 'Clinton Gormley',                    category: 'Databases',               publisher: "O'Reilly Media" },
  84: { author: 'Mirko Orlic',                        category: 'Web Development',         publisher: 'Manning' },
  85: { author: 'Leonard Richardson',                 category: 'Web Development',         publisher: "O'Reilly Media" },
  86: { author: 'Malcolm McDonald',                   category: 'Cybersecurity',           publisher: 'No Starch Press' },
  87: { author: 'Dafydd Stuttard',                    category: 'Cybersecurity',           publisher: 'Wiley' },
  88: { author: 'Jon Erickson',                       category: 'Cybersecurity',           publisher: 'No Starch Press' },
  89: { author: 'Gene Kim et al.',                    category: 'DevOps',                  publisher: 'IT Revolution' },
  90: { author: 'Nicole Forsgren et al.',             category: 'DevOps',                  publisher: 'IT Revolution' },
  91: { author: 'Peter Thiel',                        category: 'Business',                publisher: 'Crown Business' },
  92: { author: 'Eric Ries',                          category: 'Business',                publisher: 'Crown Business' },
  93: { author: 'Daniel Kahneman',                    category: 'Psychology',              publisher: 'Farrar, Straus' },
  94: { author: 'Don Norman',                         category: 'Design',                  publisher: 'Basic Books' },
  95: { author: 'Steve Krug',                         category: 'Design',                  publisher: 'New Riders' },
  96: { author: 'Eric A. Meyer',                      category: 'Web Development',         publisher: "O'Reilly Media" },
  97: { author: 'Jon Duckett',                        category: 'Web Development',         publisher: 'Wiley' },
  98: { author: 'Mark Lutz',                          category: 'Programming',             publisher: "O'Reilly Media" },
  99: { author: 'Eric Matthes',                       category: 'Programming',             publisher: 'No Starch Press' },
  100:{ author: 'Al Sweigart',                        category: 'Programming',             publisher: 'No Starch Press' },
  101:{ author: 'J.R.R. Tolkien',                     category: 'Fantasy',                 publisher: 'Allen & Unwin' },
  102:{ author: 'J.R.R. Tolkien',                     category: 'Fantasy',                 publisher: 'Allen & Unwin' },
  103:{ author: 'J.R.R. Tolkien',                     category: 'Fantasy',                 publisher: 'Allen & Unwin' },
  104:{ author: 'J.R.R. Tolkien',                     category: 'Fantasy',                 publisher: 'Allen & Unwin' },
  105:{ author: 'Frank Herbert',                      category: 'Science Fiction',         publisher: 'Chilton Books' },
  106:{ author: 'Suzanne Collins',                    category: 'Young Adult',             publisher: 'Scholastic' },
  107:{ author: 'Suzanne Collins',                    category: 'Young Adult',             publisher: 'Scholastic' },
  108:{ author: 'Suzanne Collins',                    category: 'Young Adult',             publisher: 'Scholastic' },
  109:{ author: 'James Dashner',                      category: 'Young Adult',             publisher: 'Delacorte Press' },
  110:{ author: 'James Dashner',                      category: 'Young Adult',             publisher: 'Delacorte Press' },
  111:{ author: 'John Green',                         category: 'Young Adult',             publisher: 'Dutton Books' },
  112:{ author: 'Jojo Moyes',                         category: 'Romance',                 publisher: 'Viking Books' },
  113:{ author: 'Nicholas Sparks',                    category: 'Romance',                 publisher: 'Warner Books' },
  114:{ author: 'Nicholas Sparks',                    category: 'Romance',                 publisher: 'Warner Books' },
  115:{ author: 'Audrey Niffenegger',                 category: 'Romance',                 publisher: 'MacAdam/Cage' },
  116:{ author: 'Stephen King',                       category: 'Horror',                  publisher: 'Doubleday' },
  117:{ author: 'Stephen King',                       category: 'Horror',                  publisher: 'Viking Press' },
  118:{ author: 'Stephen King',                       category: 'Horror',                  publisher: 'Doubleday' },
  119:{ author: 'Josh Malerman',                      category: 'Horror',                  publisher: 'Ecco' },
  120:{ author: 'William Peter Blatty',               category: 'Horror',                  publisher: 'Harper & Row' },
  121:{ author: 'Paulo Coelho',                       category: 'Self-Help',               publisher: 'HarperOne' },
  122:{ author: 'Eckhart Tolle',                      category: 'Self-Help',               publisher: 'New World Library' },
  123:{ author: 'James Clear',                        category: 'Self-Help',               publisher: 'Avery' },
  124:{ author: 'Napoleon Hill',                      category: 'Self-Help',               publisher: 'The Ralston Society' },
  125:{ author: 'Robert Kiyosaki',                    category: 'Personal Finance',        publisher: 'Warner Books' },
  126:{ author: 'Walter Isaacson',                    category: 'Biography',               publisher: 'Simon & Schuster' },
  127:{ author: 'Nelson Mandela',                     category: 'Biography',               publisher: 'Little, Brown' },
  128:{ author: 'Anne Frank',                         category: 'Biography',               publisher: 'Contact Publishing' },
  129:{ author: 'Michelle Obama',                     category: 'Biography',               publisher: 'Crown' },
  130:{ author: 'Tara Westover',                      category: 'Biography',               publisher: 'Random House' },
  131:{ author: 'Yuval Noah Harari',                  category: 'History',                 publisher: 'Harper' },
  132:{ author: 'Yuval Noah Harari',                  category: 'History',                 publisher: 'Harper' },
  133:{ author: 'Jared Diamond',                      category: 'History',                 publisher: 'W.W. Norton' },
  134:{ author: 'Peter Frankopan',                    category: 'History',                 publisher: 'Bloomsbury' },
  135:{ author: 'Howard Zinn',                        category: 'History',                 publisher: 'Harper & Row' },
  136:{ author: 'Morgan Housel',                      category: 'Personal Finance',        publisher: 'Harriman House' },
  137:{ author: 'Benjamin Graham',                    category: 'Personal Finance',        publisher: 'Harper' },
  138:{ author: 'Eric Ries',                          category: 'Business',                publisher: 'Crown Business' },
  139:{ author: 'Jim Collins',                        category: 'Business',                publisher: 'Harper Business' },
  140:{ author: 'W. Chan Kim & Renée Mauborgne',      category: 'Business',                publisher: 'HBR Press' },
  141:{ author: 'Sun Tzu',                            category: 'Philosophy',              publisher: 'Project Gutenberg' },
  142:{ author: 'Marcus Aurelius',                    category: 'Philosophy',              publisher: 'Project Gutenberg' },
  143:{ author: 'Friedrich Nietzsche',                category: 'Philosophy',              publisher: 'Project Gutenberg' },
  144:{ author: 'Plato',                              category: 'Philosophy',              publisher: 'Project Gutenberg' },
  145:{ author: 'Friedrich Nietzsche',                category: 'Philosophy',              publisher: 'Project Gutenberg' },
  146:{ author: 'Julia Child',                        category: 'Cooking',                 publisher: 'Knopf' },
  147:{ author: 'Samin Nosrat',                       category: 'Cooking',                 publisher: 'Simon & Schuster' },
  148:{ author: 'Anthony Bourdain',                   category: 'Cooking',                 publisher: 'Bloomsbury' },
  149:{ author: 'Harold McGee',                       category: 'Cooking',                 publisher: 'Scribner' },
  150:{ author: 'J. Kenji López-Alt',                 category: 'Cooking',                 publisher: 'W.W. Norton' },
  151:{ author: 'Andy Weir',                          category: 'Science Fiction',         publisher: 'Crown' },
  152:{ author: 'Andy Weir',                          category: 'Science Fiction',         publisher: 'Ballantine Books' },
  153:{ author: 'Ernest Cline',                       category: 'Science Fiction',         publisher: 'Crown' },
  154:{ author: 'Orson Scott Card',                   category: 'Science Fiction',         publisher: 'Tor Books' },
  155:{ author: 'Isaac Asimov',                       category: 'Science Fiction',         publisher: 'Gnome Press' },
  156:{ author: 'Isaac Asimov',                       category: 'Science Fiction',         publisher: 'Gnome Press' },
  157:{ author: 'William Gibson',                     category: 'Science Fiction',         publisher: 'Ace' },
  158:{ author: 'Neal Stephenson',                    category: 'Science Fiction',         publisher: 'Bantam Books' },
  159:{ author: 'Dan Simmons',                        category: 'Science Fiction',         publisher: 'Doubleday' },
  160:{ author: 'Ursula K. Le Guin',                  category: 'Science Fiction',         publisher: 'Ace Books' },
  161:{ author: 'Alice Walker',                       category: 'Literary Fiction',        publisher: 'Harcourt' },
  162:{ author: 'Toni Morrison',                      category: 'Literary Fiction',        publisher: 'Alfred A. Knopf' },
  163:{ author: 'Khaled Hosseini',                    category: 'Literary Fiction',        publisher: 'Riverhead Books' },
  164:{ author: 'Khaled Hosseini',                    category: 'Literary Fiction',        publisher: 'Riverhead Books' },
  165:{ author: 'Yann Martel',                        category: 'Literary Fiction',        publisher: 'Knopf Canada' },
  166:{ author: 'Markus Zusak',                       category: 'Literary Fiction',        publisher: 'Picador' },
  167:{ author: 'Anthony Doerr',                      category: 'Literary Fiction',        publisher: 'Scribner' },
  168:{ author: 'Kristin Hannah',                     category: 'Literary Fiction',        publisher: "St. Martin's Press" },
  169:{ author: 'Kathryn Stockett',                   category: 'Literary Fiction',        publisher: 'Amy Einhorn Books' },
  170:{ author: 'Sara Gruen',                         category: 'Literary Fiction',        publisher: 'Algonquin Books' },
  171:{ author: 'Gillian Flynn',                      category: 'Mystery & Thriller',      publisher: 'Crown' },
  172:{ author: 'Stieg Larsson',                      category: 'Mystery & Thriller',      publisher: 'Norstedts Förlag' },
  173:{ author: 'Liane Moriarty',                     category: 'Mystery & Thriller',      publisher: 'Berkley' },
  174:{ author: 'Gillian Flynn',                      category: 'Mystery & Thriller',      publisher: 'Shaye Areheart Books' },
  175:{ author: 'Alex Michaelides',                   category: 'Mystery & Thriller',      publisher: 'Celadon Books' },
  176:{ author: 'Colleen Hoover',                     category: 'Mystery & Thriller',      publisher: 'Montlake' },
  177:{ author: 'A.J. Finn',                          category: 'Mystery & Thriller',      publisher: 'William Morrow' },
  178:{ author: 'S.J. Watson',                        category: 'Mystery & Thriller',      publisher: 'Harper' },
  179:{ author: 'Shari Lapena',                       category: 'Mystery & Thriller',      publisher: 'Pamela Dorman Books' },
  180:{ author: 'B.A. Paris',                         category: 'Mystery & Thriller',      publisher: "St. Martin's Press" },
  181:{ author: 'Trevor Noah',                        category: 'Biography',               publisher: 'Spiegel & Grau' },
  182:{ author: 'Phil Knight',                        category: 'Biography',               publisher: 'Scribner' },
  183:{ author: 'David McCullough',                   category: 'Biography',               publisher: 'Simon & Schuster' },
  184:{ author: 'Walter Isaacson',                    category: 'Biography',               publisher: 'Simon & Schuster' },
  185:{ author: 'Walter Isaacson',                    category: 'Biography',               publisher: 'Simon & Schuster' },
  186:{ author: 'Rebecca Skloot',                     category: 'Science',                 publisher: 'Crown' },
  187:{ author: 'Jon Krakauer',                       category: 'Biography',               publisher: 'Villard Books' },
  188:{ author: 'Laura Hillenbrand',                  category: 'Biography',               publisher: 'Random House' },
  189:{ author: 'Jeannette Walls',                    category: 'Biography',               publisher: 'Scribner' },
  190:{ author: 'Paul Kalanithi',                     category: 'Biography',               publisher: 'Random House' },
  191:{ author: 'Viktor E. Frankl',                   category: 'Self-Help',               publisher: 'Beacon Press' },
  192:{ author: 'Stephen R. Covey',                   category: 'Self-Help',               publisher: 'Free Press' },
  193:{ author: 'Dale Carnegie',                      category: 'Self-Help',               publisher: 'Simon & Schuster' },
  194:{ author: 'Cal Newport',                        category: 'Self-Help',               publisher: 'Grand Central' },
  195:{ author: 'Cal Newport',                        category: 'Self-Help',               publisher: 'Portfolio' },
  196:{ author: 'Daniel H. Pink',                     category: 'Self-Help',               publisher: 'Riverhead Books' },
  197:{ author: 'Angela Duckworth',                   category: 'Self-Help',               publisher: 'Scribner' },
  198:{ author: 'Carol S. Dweck',                     category: 'Self-Help',               publisher: 'Random House' },
  199:{ author: 'Mark Manson',                        category: 'Self-Help',               publisher: 'HarperOne' },
  200:{ author: 'Don Miguel Ruiz',                    category: 'Self-Help',               publisher: 'Amber-Allen' },
  201:{ author: 'Homer',                              category: 'Classics',                publisher: 'Project Gutenberg' },
  202:{ author: 'Homer',                              category: 'Classics',                publisher: 'Project Gutenberg' },
  203:{ author: 'Miguel de Cervantes',                category: 'Classics',                publisher: 'Project Gutenberg' },
  204:{ author: 'Victor Hugo',                        category: 'Classics',                publisher: 'Project Gutenberg' },
  205:{ author: 'Alexandre Dumas',                    category: 'Classics',                publisher: 'Project Gutenberg' },
  206:{ author: 'Leo Tolstoy',                        category: 'Classics',                publisher: 'Project Gutenberg' },
  207:{ author: 'Leo Tolstoy',                        category: 'Classics',                publisher: 'Project Gutenberg' },
  208:{ author: 'Fyodor Dostoevsky',                  category: 'Classics',                publisher: 'Project Gutenberg' },
  209:{ author: 'Fyodor Dostoevsky',                  category: 'Classics',                publisher: 'Project Gutenberg' },
  210:{ author: 'Fyodor Dostoevsky',                  category: 'Classics',                publisher: 'Project Gutenberg' },
  211:{ author: 'Emily Dickinson',                    category: 'Poetry',                  publisher: 'Project Gutenberg' },
  212:{ author: 'Walt Whitman',                       category: 'Poetry',                  publisher: 'Project Gutenberg' },
  213:{ author: 'John Milton',                        category: 'Poetry',                  publisher: 'Project Gutenberg' },
  214:{ author: 'Unknown',                            category: 'Poetry',                  publisher: 'Project Gutenberg' },
  215:{ author: 'Geoffrey Chaucer',                   category: 'Classics',                publisher: 'Project Gutenberg' },
  216:{ author: 'Henry David Thoreau',                category: 'Philosophy',              publisher: 'Project Gutenberg' },
  217:{ author: 'Henry David Thoreau',                category: 'Philosophy',              publisher: 'Project Gutenberg' },
  218:{ author: 'Frederick Douglass',                 category: 'Biography',               publisher: 'Project Gutenberg' },
  219:{ author: 'Thomas Paine',                       category: 'History',                 publisher: 'Project Gutenberg' },
  220:{ author: 'Alexander Hamilton et al.',          category: 'History',                 publisher: 'Project Gutenberg' },
};

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
  const meta  = paidBookMeta[Number(book.id)];
  const extra = BOOK_EXTRA[Number(book.id)];
  return {
    ...book,
    author:      extra?.author    ?? 'Library Collection',
    category:    extra?.category  ?? book.type,
    publisher:   extra?.publisher ?? 'Library Edition',
    isbn:        `978-${String(book.id).padStart(10, '0')}`,
    copies:      3,
    description:
      meta?.description ??
      `"${book.title}" is a ${book.type.toLowerCase()} resource in our library collection. Browse the details below and borrow it when available.`,
    requiresPayment: Boolean(meta),
    price: meta?.price ?? 0,
    isPremium: !!meta,
    qrCode: meta?.qrCode ?? PAYMENT_QR_CODE,
  };
}

export function getEnrichedResources() {
  return resources.map(enrichBook);
}

export function getBookById(id) {
  const book = resources.find((b) => b.id === Number(id));
  return book ? enrichBook(book) : null;
}