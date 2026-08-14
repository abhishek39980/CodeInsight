/**
 * Language stubs for multi-language support (Python, Java, C++, TypeScript, Go).
 * Used by the LanguageSwitcher to populate the Monaco editor with a starter template.
 */

export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', monacoId: 'javascript', piston: 'javascript', version: '18.15.0' },
  { id: 'python',     label: 'Python',     monacoId: 'python',     piston: 'python',     version: '3.10.0' },
  { id: 'java',       label: 'Java',       monacoId: 'java',       piston: 'java',       version: '15.0.2' },
  { id: 'cpp',        label: 'C++',        monacoId: 'cpp',        piston: 'c++',        version: '10.2.0' },
  { id: 'typescript', label: 'TypeScript', monacoId: 'typescript', piston: 'typescript', version: '5.0.3' },
  { id: 'go',         label: 'Go',         monacoId: 'go',         piston: 'go',         version: '1.16.2' },
]

export const languageStubs = {
  'two-sum': {
    python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
`,
    java: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(Arrays.toString(sol.twoSum(new int[]{2,7,11,15}, 9)));
    }
}
`,
    cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) return {map[complement], i};
        map[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    auto res = twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
}
`,
    typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement)!, i];
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
`,
    go: `package main

import "fmt"

func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if j, ok := seen[complement]; ok {
            return []int{j, i}
        }
        seen[num] = i
    }
    return nil
}

func main() {
    fmt.Println(twoSum([]int{2, 7, 11, 15}, 9))
}
`,
  },

  'maximum-subarray': {
    python: `def max_subarray(nums):
    max_sum = nums[0]
    current = nums[0]
    for num in nums[1:]:
        current = max(num, current + num)
        max_sum = max(max_sum, current)
    return max_sum

print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6
`,
    java: `public class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0], current = nums[0];
        for (int i = 1; i < nums.length; i++) {
            current = Math.max(nums[i], current + nums[i]);
            maxSum = Math.max(maxSum, current);
        }
        return maxSum;
    }
    public static void main(String[] args) {
        System.out.println(new Solution().maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));
    }
}
`,
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0], current = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        current = max(nums[i], current + nums[i]);
        maxSum = max(maxSum, current);
    }
    return maxSum;
}
int main() {
    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};
    cout << maxSubArray(nums) << endl;
}
`,
  },

  'valid-parentheses': {
    python: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack

print(is_valid("()[]{}"))  # True
print(is_valid("(]"))      # False
`,
  },
}

export function getStubForProblem(problemId, language) {
  return languageStubs[problemId]?.[language] ?? null
}
