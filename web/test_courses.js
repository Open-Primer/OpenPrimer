const { dbService } = require('./src/lib/db');
dbService.getAllCourses().then(({ data }) => {
  console.log(data.map(c => ({ id: c.id, title: c.title, subject: c.subject, level: c.level, slug: c.slug })));
}).catch(err => {
  console.error(err);
});
