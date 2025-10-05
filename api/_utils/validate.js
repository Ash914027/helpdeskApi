exports.validateTicket = (body) => {
  const errors = [];
  if (!body) {
    errors.push({ msg: 'Body is required' });
    return errors;
  }
  if (!body.title || String(body.title).trim() === '') {
    errors.push({ param: 'title', msg: 'Title is required' });
  } else if (String(body.title).length > 200) {
    errors.push({ param: 'title', msg: 'Title must be less than 200 characters' });
  }
  if (!body.description || String(body.description).trim() === '') {
    errors.push({ param: 'description', msg: 'Description is required' });
  }
  if (body.priority) {
    const allowed = ['low', 'medium', 'high', 'critical'];
    if (!allowed.includes(body.priority)) {
      errors.push({ param: 'priority', msg: 'Invalid priority' });
    }
  }
  return errors;
};

exports.validateComment = (body) => {
  const errors = [];
  if (!body) {
    errors.push({ msg: 'Body is required' });
    return errors;
  }
  if (!body.author || String(body.author).trim() === '') {
    errors.push({ param: 'author', msg: 'Author is required' });
  }
  if (!body.text || String(body.text).trim() === '') {
    errors.push({ param: 'text', msg: 'Comment text is required' });
  }
  return errors;
};
