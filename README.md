# iubh-tempermonky-course-registration
A simple hack to enable course registration through js script injection on [MyCampus](https://mycampus.iubh.de/).

1. Open [https://mycampus.iubh.de/local/iubh_ac5sso/ac5kursbuchung.php](https://mycampus.iubh.de/local/iubh_ac5sso/ac5kursbuchung.php)

2. **Inspect the side loading process** in your browser.

3. **Investigate** `https://care-fs.iubh.de/ajax/4713/CourseInscriptionCurricular/DefaultController/fetchCurriculumEntry?bookingId=123456789` and note down the [booking id](script.js#L97).

   - Find all relevant courses, and note the course name (child label), curriculum entry ID (child ID), and subject ID (subject ID of the child). Consider the deepest children only.
   - Check if the [enrollment period](script.js#L96) is correct.

4. **Investigate** `https://care-fs.iubh.de/ajax/4713/CourseInscriptionCurricular/DefaultController/fetchCourses?bookingId=123456789` and find for each subject ID the corresponding lecture series.

   - Note down the [lecture series ID](script.js#L15L48) and the [curriculum entry ID](script.js#L15L48) for each course, e.g.:

| Course | Curriculum Entry ID | Lecture Series ID |
| ------ | ------------------- | ----------------- |
| Advanced Mathematics | 10559081 | 10053254 |
| Advanced Statistics | 10559083 | 10053256 |
| Algorithmics | 10559090 | 10052515 |
| ... | ... | ... |

5. **Install [Tampermonkey](https://www.tampermonkey.net)** and install the [script.js](script.js).

This script will add the drop-down selectors and a  button on your course registration page for easy course booking:

[![screenshot](assets/screenshot.png)](https://mycampus.iubh.de/)

**Happy hacking!**
