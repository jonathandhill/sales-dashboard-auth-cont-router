-- I wanted to join "courses" table (teacher) with "teachers" table (name)
-- We don't need to specify which table if its unique column name

SELECT
  title,
  location
FROM courses
INNER JOIN teacher ON courses.teacher = teacher.name

-- previous query 
select
	name,
	sum(value)
from
	sales_deals
group by
	name;


--