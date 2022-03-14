import './style.scss'

//TODO: Refactor all other components to have their tsx and styles in each component's folder
type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
}

export function Question ({content, author} : QuestionProps) {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>

      </footer>
    </div>
  );
}