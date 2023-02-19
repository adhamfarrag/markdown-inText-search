<template>
  <div class="relative flex flex-col w-10/12 px-5 mx-auto">
    <div class="flex flex-col lg:flex-row justify-between mt-3">
      <div
        class="sticky z-50 flex-col w-full lg:w-3/12 lg:h-screen flex top-2 bottom-12"
      >
        <div
          class="flex z-50 items-center justify-center w-full h-12 p-3 mt-8 mb-4 bg-white rounded-md shadow-xl"
        >
          <div
            class="relative flex items-center w-full h-10 duration-200 transform group"
          >
            <IconSearch
              class="absolute left-0 w-5 h-5 ml-1.5 text-gray-400 fill-current"
            />
            <input
              type="search"
              ref="searchInput"
              class="w-full ml-8 mr-5 text-sm placeholder-gray-500 outline-none hide-clear group-focus-within:placeholder-gray-300 ring-0 focus:border-blue-600 border-shade focus:outline-none focus:ring-0"
              placeholder="Search this article. ex: Imrpoved or "
              v-model.lazy="articleSearchAndLocate"
              v-debounce="delay"
              autocomplete="off"
            />
          </div>
        </div>
      </div>

      <div class="w-full z-10 lg:w-8/12">
        <div
          id="articleContainer"
          class="flex flex-col items-start mx-auto mt-3 space-y-3 font-semibold"
        >
          <p class="text-3xl text-left lg:w-11/12 xl:w-10/12 md:text-4xl">
            {{ article.title }}
          </p>
        </div>
        <div class="flex flex-col items-start mx-auto mt-10">
          <div
            v-html="$md.render(applyHighlights)"
            class="mt-4 mb-20 prose duration-200 transform -pl-5 md:prose-md"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { convertToPlainText } from '~/composables/Markdown'
import debounce from 'v-debounce'

export default {
  scrollToTop: true,
  data() {
    return {
      articleScroll: 0,
      delay: 500,
      windowHeight: null,
      selectedFile: [],
      lunchViewer: false,
      articleSearchAndLocate: '',
      articlecontainer: null,
      article: {
        title: 'The Benefits of Regular Exercise',
        body: `Regular exercise is essential for maintaining good physical and mental health. Many people struggle to find the motivation to exercise regularly, but the benefits are well worth the effort. In this article, we'll explore the numerous benefits of regular exercise and provide tips for making exercise a regular part of your routine.

## Physical Health Benefits

1. **Weight Control**

Exercise is one of the most effective ways to manage your weight. Regular exercise helps you burn calories, which is essential for weight loss. Additionally, exercise helps you build muscle, which increases your metabolism and helps you burn more calories even when you're at rest.

![woman lifting weights](https://images.pexels.com/photos/6473925/pexels-photo-6473925.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)

2. **Reduced Risk of Chronic Diseases**

Regular exercise can help reduce your risk of chronic diseases like type 2 diabetes, heart disease, and stroke. Exercise helps improve blood sugar control, lowers blood pressure, and improves cholesterol levels.

3. **Improved Strength and Flexibility**

Exercise helps build muscle, which is essential for maintaining good physical health. Additionally, exercise helps improve flexibility and balance, which can help prevent falls and injuries.

## Mental Health Benefits

1. **Reduced Stress and Anxiety**

Exercise is a natural stress reliever. When you exercise, your body releases endorphins, which are feel-good chemicals that help reduce stress and anxiety.

![woman doing yoga](https://images.pexels.com/photos/4052643/pexels-photo-4052643.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)

2. **Improved Mood**

Regular exercise has been shown to improve mood and reduce symptoms of depression. Exercise helps increase the production of neurotransmitters like dopamine and serotonin, which are essential for regulating mood.

3. **Improved Cognitive Function**

Exercise has been shown to improve cognitive function, including memory and attention. Exercise helps increase blood flow to the brain, which is essential for maintaining good cognitive function.

## Tips for Making Exercise a Regular Part of Your Routine

1. **Find an Activity You Enjoy**

The key to making exercise a regular part of your routine is to find an activity that you enjoy. Whether it's running, swimming, or yoga, find an activity that you look forward to and that fits into your schedule.

2. **Set Realistic Goals**

Setting realistic goals can help you stay motivated and make exercise a regular part of your routine. Start small and gradually increase your goals as you become more comfortable with your exercise routine.

3. **Make it a Habit**

Make exercise a regular part of your routine by scheduling it into your calendar and treating it like any other important appointment.

In conclusion, regular exercise is essential for maintaining good physical and mental health. By incorporating exercise into your routine, you can enjoy numerous benefits, including weight control, reduced risk of chronic diseases, and improved mood and cognitive function. So, start small, find an activity you enjoy, and make exercise a regular part of your routine. Your body and mind will thank you!
`,
      },
    }
  },

  methods: {
    handleScroll() {
      this.articleScroll = window.scrollY
    },
    onResize() {
      if (process.browser) {
        this.windowHeight = window.innerHeight
      }
    },
    lunchTheViewer(file) {
      this.selectedFile = file
      this.lunchViewer = true
    },
    closeViewer() {
      this.lunchViewer = false
      this.selectedFile = []
    },
    focusSearchInput() {
      this.$refs.searchInput.focus()
    },
    searchFocusListener(event) {
      if (event.keyCode === 47 && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault()
        this.focusSearchInput()
      }
    },
    scrollToResult() {
      this.$scrollTo('.result', 500, {
        easing: 'ease-in',
        lazy: true,
        offset: -70,
        force: true,
        cancelable: true,
      })
    },
  },
  mounted() {
    if (process.client) {
      this.windowHeight = window.innerHeight
    }
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
      window.addEventListener('keydown', (event) => {
        if (event.keyCode === 27) {
          this.$refs.searchInput.blur()
        }
      })
    })
  },

  directives: {
    debounce,
  },

  computed: {
    applyHighlights() {
      let article = this.article.body
      this.articlecontainer = convertToPlainText(article)
      let searchText = this.articleSearchAndLocate
      const regex = new RegExp(
        '(!\\[[^\\][]*]\\([^()]*\\))|' +
          searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
        'gi'
      )
      let text = article
      if (this.articleSearchAndLocate == '') {
        return text
      } else {
        const newText = text.replace(regex, function (x, y) {
          return y
            ? y
            : '<span id="searchResult" class="rounded-sm shadow-xl py-0.25 px-1 bg-blue-600 text-white font-semibold text-tint">' +
                x +
                '</span>'
        })

        setTimeout(() => {
          if (process.client) {
            let results = document.querySelectorAll('#searchResult')
            console.log(results.length)
          }
        }, 300)
        return newText
      }
    },
  },
  watch: {
    articleSearchAndLocate(newValue) {
      if (newValue.length > 3) {
        setTimeout(() => {
          this.$scrollTo('#searchResult', 500, {
            easing: 'ease-in',
            lazy: true,
            offset: -45,
            force: true,
            cancelable: true,
          })
        }, 600)
      } else if (newValue.length == 0) {
        this.$scrollTo('#articleContainer', 500, {
          easing: 'ease-in',
          lazy: true,
          offset: -30,
          force: true,
          cancelable: true,
        })
      }
    },
  },
  created() {
    if (process.client) {
      window.addEventListener('scroll', this.handleScroll)
    }
  },
  beforeMount() {
    window.addEventListener('keypress', this.searchFocusListener)
  },
  beforeDestroy() {
    window.removeEventListener('keypress', this.searchFocusListener)
  },
  destroyed() {
    if (process.client) {
      window.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('resize', this.onResize)
    }
  },
}
</script>

<style scoped>
.nuxt-link-exact-active {
  @apply font-semibold;
}
</style>
